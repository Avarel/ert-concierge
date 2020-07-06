//! This file manages the low-level internal implementation of the WebSocket
//! handle for the Concierge. Some functions are delegated to from the Concierge.

use super::{Concierge, Group};
use crate::{
    clients::Client,
    payload::{self, close_codes, Payload},
};
pub use error::WsError;
use futures::{future, pin_mut, SinkExt, Stream, StreamExt};
use log::{debug, info, trace, warn};
use payload::{Origin, Target};
use semver::{Version, VersionReq};
use std::{net::SocketAddr, path::Path, time::Duration};
use tokio::{sync::mpsc::UnboundedReceiver, time::timeout};
use uuid::Uuid;
use warp::ws::{Message, WebSocket};

mod error {
    #[derive(Debug, Copy, Clone)]
    pub enum WsError {
        Channel,
        Json,
        DuplicateAuth,
        Socket,
        Internal,
    }

    impl From<warp::Error> for WsError {
        fn from(_: warp::Error) -> Self {
            Self::Socket
        }
    }

    impl From<serde_json::Error> for WsError {
        fn from(_: serde_json::Error) -> Self {
            Self::Json
        }
    }
}

/// Broadcast a payload to all connected clients of a certain group.
pub(super) async fn broadcast(
    concierge: &Concierge,
    group: &Group,
    payload: Payload<'_>,
) -> Result<(), WsError> {
    let message = Message::text(serde_json::to_string(&payload)?);
    let clients = concierge.clients.read().await;
    for uuid in group.clients.iter() {
        if let Some(client) = clients.get(uuid) {
            client.send_ws_msg(message.clone())?;
        } else {
            warn!("Group had an invalid client id");
        }
    }
    Ok(())
}

/// Broadcast to all connected clients.
pub(super) async fn broadcast_all(
    concierge: &Concierge,
    payload: Payload<'_>,
) -> Result<(), WsError> {
    let message = Message::text(serde_json::to_string(&payload)?);
    let clients = concierge.clients.read().await;
    for (_, client) in clients.iter() {
        client.send_ws_msg(message.clone())?;
    }
    Ok(())
}

/// Handle the first 5 seconds of identification.
async fn handle_identification(socket: &mut WebSocket) -> Result<String, u16> {
    // Protocol: Expect a payload that identifies the client within 5 seconds.
    if let Ok(Some(Ok(msg))) = timeout(Duration::from_secs(5), socket.next()).await {
        // debug!("{:?}", msg);
        if let Ok(payload) = msg
            .to_str()
            .and_then(|s| serde_json::from_str(s).map_err(|_| ()))
        {
            if let Payload::Identify {
                name,
                version,
                secret,
            } = payload
            {
                if secret != crate::SECRET {
                    return Err(close_codes::BAD_SECRET);
                } else if !VersionReq::parse(crate::VERSION)
                    .unwrap()
                    .matches(&Version::parse(version).unwrap())
                {
                    return Err(close_codes::BAD_VERSION);
                }
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
) -> Result<(Uuid, UnboundedReceiver<Message>), WsError> {
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
            .await
            .map_err(|_| WsError::DuplicateAuth)?;
        socket.close().await?;
        return Err(WsError::DuplicateAuth);
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
    )
    .await?;

    concierge.clients.write().await.insert(uuid, client);

    Ok((uuid, rx))
}

/// Handle incoming TCP connections and upgrade them to a Websocket connection.
pub async fn handle_socket_conn(
    concierge: &Concierge,
    mut socket: WebSocket,
    addr: SocketAddr,
) -> Result<(), WsError> {
    // Protocol: Expect a payload that identifies the client within 5 seconds.
    match handle_identification(&mut socket).await {
        // Got the identification data successfully.
        Ok(name) => {
            debug!("Identification successful. (ip: {}, name: {})", addr, name);
            let (uuid, rx) = make_client(concierge, name, &mut socket).await?;
            handle_client(concierge, uuid, rx, socket).await?;
            remove_client(concierge, uuid).await?;
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
    client_uuid: Uuid,
    rx: UnboundedReceiver<Message>,
    socket: WebSocket,
) -> Result<(), WsError> {
    // This is the WebSocket channels for messages.
    // incoming: where we receive messages
    // outgoing: where the websocket send messages
    let (outgoing, incoming) = socket.split();
    // Have the client handle incoming messages.
    let incoming_handler = handle_incoming_messages(client_uuid, concierge, incoming);
    // Forward our sent messages (from tx) to the outgoing sink.
    // This is because the client acts upon channels and doesn't know what the websocket is.
    let receive_from_others = rx
        .inspect(|m| {
            if let Ok(string) = m.to_str() {
                trace!("Sending text (id: {}): {}", client_uuid, string);
            }
        })
        .map(Ok)
        .forward(outgoing);

    // Setup complete, send the Hello payload.
    concierge
        .clients
        .read()
        .await
        .get(&client_uuid)
        .unwrap()
        .send(Payload::Hello {
            uuid: client_uuid,
            version: crate::VERSION,
        })?;

    // Irrelevant implementation detail: pinning prevents pointer invalidation
    pin_mut!(incoming_handler, receive_from_others);
    // Select waits for the first task to complete: in this case, its whether
    // the stream `receive_from_others` end or `broadcast_incoming` end first,
    // which indicates that the client connection is dead.
    future::select(incoming_handler, receive_from_others).await;
    Ok(())
}

async fn remove_client(concierge: &Concierge, client_uuid: Uuid) -> Result<(), WsError> {
    // let client = concierge.clients.get(&client_uuid).unwrap();
    // let client_name = client.name();
    // let origin_receipt = client.origin_receipt();

    // Connection has been destroyed by this stage.
    info!("Client disconnected. (id: {})", client_uuid);
    let client = concierge.remove_client(client_uuid).await?;

    // Broadcast leave
    broadcast_all(
        concierge,
        Payload::ClientLeave {
            data: client.origin_receipt(),
        },
    )
    .await?;

    // Delete clientfile folder if it exists
    let path = Path::new(".").join("fs").join(client.name());
    if let Ok(_) = tokio::fs::remove_dir_all(&path).await {
        info!("Deleted {}.", path.display());
    } else {
        warn!(
            "Could not delete {} (it might not exist, and that's ok).",
            path.display()
        );
    }

    Ok(())
}

/// Handle incoming payloads with the client information.
pub async fn handle_incoming_messages<E>(
    uuid: Uuid,
    concierge: &Concierge,
    mut incoming: impl Stream<Item = Result<Message, E>> + Unpin,
) -> Result<(), WsError> {
    while let Some(Ok(message)) = incoming.next().await {
        if let Ok(string) = message.to_str() {
            if let Ok(payload) = serde_json::from_str::<Payload>(string) {
                handle_payload(uuid, concierge, payload).await?;
            } else {
                let clients = concierge.clients.read().await;
                let client = clients.get(&uuid).unwrap();
                client.send(payload::err::protocol())?;
            }
        }
    }

    Ok(())
}

async fn handle_payload(
    client_uuid: Uuid,
    concierge: &Concierge,
    payload: Payload<'_>,
) -> Result<(), WsError> {
    let clients = concierge.clients.read().await;
    let client = clients.get(&client_uuid).unwrap();

    match payload {
        Payload::Message { target, data, .. } => {
            handle_message(client_uuid, concierge, target, data).await?
        }
        Payload::Subscribe { group } => {
            let mut groups = concierge.groups.write().await;
            if let Some(group) = groups.get_mut(group) {
                group.clients.insert(client.uuid());
                client.groups.write().await.insert(group.name.to_owned());
                client.send(payload::ok::subscribed(&group.name))?;
            } else {
                client.send(payload::err::no_such_group(group))?;
            }
        }
        Payload::Unsubscribe { group } => {
            let mut groups = concierge.groups.write().await;
            if let Some(group) = groups.get_mut(group) {
                group.clients.remove(&client.uuid());
                client.send(payload::ok::unsubscribed(&group.name))?;
            } else {
                client.send(payload::err::no_such_group(group))?;
            }

            let mut groups = client.groups.write().await;
            groups.remove(group);
        }
        Payload::CreateGroup { group } => {
            let mut groups = concierge.groups.write().await;
            if !groups.contains_key(group) {
                groups.insert(
                    group.to_owned(),
                    Group::new(group.to_owned(), client.uuid()),
                );
                client.send(payload::ok::created_group(group))?;
            } else {
                client.send(payload::err::group_already_created(group))?;
            }
        }
        Payload::DeleteGroup { group } => {
            if concierge.remove_group(group, client.uuid()).await {
                client.send(payload::ok::deleted_group(group))?;
            } else {
                client.send(payload::err::no_such_group(group))?;
            }
        }
        Payload::Broadcast { data, .. } => {
            concierge
                .broadcast_all(Payload::Broadcast {
                    origin: Some(client.origin_receipt()),
                    data,
                })
                .await?;
            client.send(payload::ok::message_sent())?;
        }
        Payload::FetchGroupSubs { group } => {
            if let Some(group) = concierge.groups.read().await.get(group) {
                let clients = group
                    .clients
                    .iter()
                    .filter_map(|uuid| clients.get(uuid))
                    .map(|client| Origin {
                        name: client.name(),
                        uuid: client.uuid(),
                    })
                    .collect::<Vec<_>>();
                client.send(Payload::GroupSubList {
                    group: &group.name,
                    clients,
                })?;
            }
        }
        Payload::FetchClientList => {
            let clients = clients
                .iter()
                .map(|(&uuid, client)| Origin {
                    name: client.name(),
                    uuid,
                })
                .collect::<Vec<_>>();
            client.send(Payload::ClientList { clients })?;
        }
        Payload::FetchGroupList => {
            let groups = concierge.groups.read().await;
            let group_names = groups.iter().map(|(name, _)| name.as_str()).collect();
            client.send(Payload::GroupList {
                groups: group_names,
            })?;
        }
        Payload::FetchSubs => {
            let groups = concierge.groups.read().await;
            let group_names = groups.iter().map(|(s, _)| s.as_str()).collect::<Vec<_>>();
            client.send(Payload::SubList {
                groups: group_names,
            })?
        }
        _ => client.send(payload::err::unsupported())?,
    }
    Ok(())
}

async fn handle_message(
    client_uuid: Uuid,
    concierge: &Concierge,
    target: Target<'_>,
    data: serde_json::Value,
) -> Result<(), WsError> {
    let clients = concierge.clients.read().await;
    let client = clients.get(&client_uuid).unwrap();
    match target {
        Target::Name { name } => {
            if let Some(target_client) = concierge
                .namespace
                .read()
                .await
                .get(name)
                .and_then(|id| clients.get(&id))
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
            if let Some(target_client) = clients.get(&uuid) {
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
            if let Some(group) = concierge.groups.read().await.get(group) {
                group
                    .broadcast(
                        concierge,
                        Payload::Message {
                            origin: Some(client.origin_receipt()),
                            target,
                            data,
                        },
                    )
                    .await?;
                client.send(payload::ok::message_sent())
            } else {
                client.send(payload::err::no_such_group(group))
            }
        }
    }
}
