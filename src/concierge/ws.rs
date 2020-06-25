//! This file manages the low-level internal implementation of the WebSocket
//! handle for the Concierge. Some functions are delegated to from the Concierge.

use super::{Concierge, Group};
use crate::{
    clients::Client,
    payload::{close_codes, Payload, self},
};
use anyhow::{anyhow, Result};
use dashmap::ElementGuard;
use flume::Receiver;
use futures::{future, pin_mut, stream::TryStreamExt, SinkExt, StreamExt, Stream};
use log::{debug, info, trace, warn};
use std::{net::SocketAddr, path::Path, time::Duration};
use tokio::time::timeout;
use uuid::Uuid;
use warp::ws::{Message, WebSocket};
use payload::{OwnedOrigin, Target};

/// Broadcast a payload to all connected clients of a certain group.
pub(super) fn broadcast(concierge: &Concierge, group: &Group, payload: Payload) -> Result<()> {
    let message = Message::text(serde_json::to_string(&payload)?);
    for entry in group.clients.iter() {
        if let Some(client) = concierge.clients.get(entry.key()) {
            client.send_ws_msg(message.clone())?;
        } else {
            warn!("Group had an invalid client id");
        }
    }
    Ok(())
}

/// Broadcast to all connected clients.
pub(super) fn broadcast_all(concierge: &Concierge, payload: Payload) -> Result<()> {
    let message = Message::text(serde_json::to_string(&payload)?);
    for client in concierge.clients.iter() {
        client.send_ws_msg(message.clone())?;
    }
    Ok(())
}

/// Handle the first 5 seconds of identification.
async fn handle_identification(socket: &mut WebSocket) -> Result<String, u16> {
    // Protocol: Expect a payload that identifies the client within 5 seconds.
    if let Ok(Some(Ok(msg))) = timeout(Duration::from_secs(5), socket.next()).await {
        debug!("{:?}", msg);
        if let Ok(payload) = msg
            .to_str()
            .and_then(|s| serde_json::from_str::<Payload>(s).map_err(|_| ()))
        {
            if let Payload::Identify { name } = payload {
                return Ok(name.to_owned());
            } else {
                return Err(close_codes::NO_AUTH);
            }
        } else {
            return Err(close_codes::FATAL_DECODE);
        }
    }
    Err(close_codes::AUTH_FAILED)
}

async fn make_client(
    concierge: &Concierge,
    name: String,
    socket: &mut WebSocket,
) -> Result<(ElementGuard<Uuid, Client>, Receiver<Message>)> {
    // Acquire a write lock to prevent race condition
    let mut namespace = concierge.namespace.write().await;
    // Duplicate identification, close the stream.
    if namespace.contains_key(&name) {
        warn!("User attempted to join with existing id. (name: {})", name);
        socket
            .send(Message::close_with(
                close_codes::DUPLICATE_AUTH,
                "Identification failed",
            ))
            .await?;
        socket.close().await?;
        return Err(anyhow!("Duplicate identification"));
    }

    // Handle new client
    let uuid = Uuid::new_v4();
    // Add to namespace
    namespace.insert(name.clone(), uuid);
    // Create the client struct
    let (client, rx) = Client::new(uuid, name);

    broadcast_all(
        concierge,
        Payload::ClientJoin {
            data: client.origin_receipt(),
        },
    )?;
    Ok((concierge.clients.insert_and_get(uuid, client), rx))
}

/// Handle incoming TCP connections and upgrade them to a Websocket connection.
pub async fn handle_socket_conn(
    concierge: &Concierge,
    mut socket: WebSocket,
    addr: SocketAddr,
) -> Result<()> {
    // Protocol: Expect a payload that identifies the client within 5 seconds.
    match handle_identification(&mut socket).await {
        // Got the identification data successfully.
        Ok(name) => {
            debug!("Identification successful. (ip: {}, name: {})", addr, name);
            let (client, rx) = make_client(concierge, name, &mut socket).await?;
            handle_client(concierge, &client, rx, socket).await?;
            remove_client(concierge, &client).await?;
            Ok(())
        }
        // Failure: send close code to the client and drop the connection.
        Err(close_code) => {
            warn!(
                "Client failed to identify properly or in time. (ip: {})",
                addr
            );
            socket
                .send(Message::close_with(close_code, "Identification failed"))
                .await?;
            Ok(socket.close().await?)
        }
    }
}

/// Handle new client WebSocket connections.
async fn handle_client(
    concierge: &Concierge,
    client: &Client,
    rx: Receiver<Message>,
    socket: WebSocket,
) -> Result<()> {
    // This is the WebSocket channels for messages.
    // incoming: where we receive messages
    // outgoing: where the websocket send messages
    let (outgoing, incoming) = socket.split();
    // Have the client handle incoming messages.
    let incoming_handler =
        handle_incoming_messages(client.uuid(), concierge, incoming.map_err(|e| e.into()));
    // Forward our sent messages (from tx) to the outgoing sink.
    // This is because the client acts upon channels and doesn't know what the websocket is.
    let receive_from_others = rx
        .inspect(|m| {
            if let Ok(string) = m.to_str() {
                trace!("Sending text (id: {}): {}", client.uuid(), string);
            }
        })
        .map(Ok)
        .forward(outgoing);

    // Setup complete, send the Hello payload.
    client.send(Payload::Hello {
        uuid: client.uuid(),
    })?;

    // Irrelevant implementation detail: pinning prevents pointer invalidation
    pin_mut!(incoming_handler, receive_from_others);
    // Select waits for the first task to complete: in this case, its whether
    // the stream `receive_from_others` end or `broadcast_incoming` end first,
    // which indicates that the client connection is dead.
    future::select(incoming_handler, receive_from_others).await;
    Ok(())
}

async fn remove_client(concierge: &Concierge, client: &Client) -> Result<()> {
    // Connection has been destroyed by this stage.
    info!("Client disconnected. (id: {})", client.name());
    concierge.remove_client(client.uuid()).await?;

    // Broadcast leave
    broadcast_all(
        concierge,
        Payload::ClientLeave {
            data: client.origin_receipt(),
        },
    )?;

    // Delete clientfile folder if it exists
    tokio::fs::remove_dir_all(Path::new(".").join("fs").join(client.name())).await?;

    Ok(())
}

/// Handle incoming payloads with the client information.
pub async fn handle_incoming_messages(
    uuid: Uuid,
    concierge: &Concierge,
    mut incoming: impl Stream<Item = Result<Message>> + Unpin,
) -> Result<()> {
    while let Some(Ok(message)) = incoming.next().await {
        if let Ok(string) = message.to_str() {
            // safe unwrap since client can only be removed when in `handle_socket_conn`,
            // in which this stream would have already been  stopped
            let client = concierge.clients.get(&uuid).unwrap();
            if let Ok(payload) = serde_json::from_str::<Payload>(string) {
                handle_payload(&client, concierge, payload).await?;
            } else {
                client.send(payload::err::protocol())?;
            }
        }
    }

    Ok(())
}

async fn handle_payload(client: &Client, concierge: &Concierge, payload: Payload<'_>) -> Result<()> {
    match payload {
        Payload::Message { target, data, .. } => {
            handle_message(client, concierge, target, data).await?
        }
        Payload::Subscribe { group } => {
            if let Some(group) = concierge.groups.get(group) {
                group.clients.insert(client.uuid(), ());
                client.groups.write().await.insert(group.name.to_owned());
                client.send(payload::ok::subscribed(group.key()))?;
            } else {
                client.send(payload::err::no_such_group(group))?;
            }
        }
        Payload::Unsubscribe { group } => {
            if let Some(group) = concierge.groups.get(group) {
                group.clients.remove(&client.uuid());
                client.send(payload::ok::unsubscribed(group.key()))?;
            } else {
                client.send(payload::err::no_such_group(group))?;
            }

            let mut groups = client.groups.write().await;
            groups.remove(group);
        }
        Payload::CreateGroup { group } => {
            if !concierge.groups.contains_key(group) {
                concierge
                    .groups
                    .insert(group.to_owned(), Group::new(group.to_owned(), client.uuid()));
                client.send(payload::ok::created_group(group))?;
            } else {
                client.send(payload::err::group_already_created(group))?;
            }
        }
        Payload::DeleteGroup { group } => {
            if concierge.remove_group(group, client.uuid()) {
                client.send(payload::ok::deleted_group(group))?;
            } else {
                client.send(payload::err::no_such_group(group))?;
            }
        }
        Payload::Broadcast { data, .. } => {
            concierge.broadcast_all(Payload::Broadcast {
                origin: Some(client.origin_receipt()),
                data,
            })?;
            client.send(payload::ok::message_sent())?;
        }
        Payload::FetchGroupSubs { group } => {
            if let Some(group) = concierge.groups.get(group) {
                // let clients = std::collections::HashSet::<Uuid>::new();
                // let cmap = std::collections::HashMap::<Uuid, Client>::new();
                // clients.iter().filter_map(|e| cmap.get(e)).map(|c| Origin { name: &c.name, uuid: c.uuid });

                let clients = group
                    .clients
                    .iter()
                    .filter_map(|e| concierge.clients.get(e.key()))
                    .map(|c| OwnedOrigin {
                        name: c.name().to_owned(),
                        uuid: c.uuid(),
                    })
                    .collect::<Vec<_>>();
                client.send(Payload::GroupSubs {
                    group: &group.name,
                    clients,
                })?;
            }
        }
        Payload::FetchClientList => {
            let clients = concierge
                .clients
                .iter()
                .map(|c| OwnedOrigin {
                    name: c.name().to_owned(),
                    uuid: c.uuid(),
                })
                .collect::<Vec<_>>();
            client.send(Payload::ClientList { clients })?;
        }
        Payload::FetchGroupList => {
            let groups = concierge
                .groups
                .iter()
                .map(|e| e.key().to_owned())
                .collect();
            client.send(Payload::GroupList { groups })?;
        }
        Payload::FetchSubs => {
            let groups = client.groups.read().await.clone();
            client.send(Payload::Subs { groups })?
        }
        _ => client.send(payload::err::unsupported())?,
    }
    Ok(())
}

async fn handle_message(
    client: &Client,
    concierge: &Concierge,
    target: Target<'_>,
    data: serde_json::Value,
) -> Result<()> {
    match target {
        Target::Name { name } => {
            if let Some(target_client) = concierge
                .namespace
                .read()
                .await
                .get(name)
                .and_then(|id| concierge.clients.get(&id))
            {
                target_client.send(Payload::Message {
                    origin: Some(client.origin_receipt()),
                    target,
                    data,
                })?;
                client.send(payload::ok::message_sent())
            } else {
                client.send(payload::err::no_such_name(name))
            }
        }
        Target::Uuid { uuid } => {
            if let Some(target_client) = concierge.clients.get(&uuid) {
                target_client.send(Payload::Message {
                    origin: Some(client.origin_receipt()),
                    target,
                    data,
                })?;
                client.send(payload::ok::message_sent())
            } else {
                client.send(payload::err::no_such_uuid(uuid))
            }
        }
        Target::Group { group } => {
            if let Some(group) = concierge.groups.get(group) {
                group.broadcast(
                    concierge,
                    Payload::Message {
                        origin: Some(client.origin_receipt()),
                        target,
                        data,
                    },
                )?;
                client.send(payload::ok::message_sent())
            } else {
                client.send(payload::err::no_such_group(group))
            }
        }
    }
}