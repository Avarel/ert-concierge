//! This file manages the low-level internal implementation of the WebSocket
//! handle for the Concierge. Some functions are delegated to from the Concierge.

use super::{Concierge, Group};
use crate::{
    clients::Client,
    payload::{close_codes, Payload},
};
use anyhow::{anyhow, Result};
use dashmap::ElementGuard;
use flume::Receiver;
use futures::{future, pin_mut, stream::TryStreamExt, SinkExt, StreamExt};
use log::{debug, info, warn};
use std::{net::SocketAddr, path::Path, time::Duration};
use tokio::time::timeout;
use uuid::Uuid;
use warp::ws::{Message, WebSocket};

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
        client.handle_incoming_messages(concierge, incoming.map_err(|e| e.into()));
    // Forward our sent messages (from tx) to the outgoing sink.
    // This is because the client acts upon channels and doesn't know what the websocket is.
    let receive_from_others = rx
        .inspect(|m| {
            if let Ok(string) = m.to_str() {
                debug!("Sending text (id: {}): {}", client.name(), string);
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
