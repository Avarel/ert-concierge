//! This file manages the low-level internal implementation of the WebSocket handle.

use super::{Concierge, Group};
use crate::clients::Client;
use concierge_api_rs::{
    payload::{Payload, PayloadRawMessage, Target},
    status::{err, ok, StatusPayload},
    CloseReason, JsonPayload,
};
pub use error::WsError;
use futures::{future, pin_mut, SinkExt, Stream, StreamExt};
use log::{debug, info, warn};
use semver::Version;
use serde::Serialize;
use std::{net::SocketAddr, path::Path, sync::Arc, time::Duration};
use tokio::{sync::mpsc::UnboundedReceiver, time::timeout};
use uuid::Uuid;
use warp::ws::{Message, WebSocket};

mod error {
    #[derive(thiserror::Error, Debug)]
    pub enum WsError {
        #[error("Channel send error")]
        Channel,
        #[error("Serialization error: `{0}`")]
        Json(#[from] serde_json::Error),
        #[error("Conflicting name in namespace")]
        DuplicateName,
        #[error("Socket error: `{0}`")]
        Socket(#[from] warp::Error),
        #[error("Internal error")]
        Internal,
    }
}

/// Broadcast a payload to all connected clients of a certain group.
pub(super) async fn broadcast(
    concierge: &Concierge,
    group: &Group,
    payload: &impl Serialize,
) -> Result<(), WsError> {
    let message = Message::text(serde_json::to_string(&payload)?);
    let clients = concierge.clients.read().await;
    for uuid in group.clients.iter() {
        if let Some(client) = clients.get(uuid) {
            client.send_ws_msg(message.clone()).ok();
        } else {
            warn!("Group had an invalid client id");
        }
    }
    Ok(())
}

/// Broadcast to all connected clients.
pub(super) async fn broadcast_all(
    concierge: &Concierge,
    payload: &impl Serialize,
) -> Result<(), WsError> {
    let message = Message::text(serde_json::to_string(&payload)?);
    let clients = concierge.clients.read().await;
    for (_, client) in clients.iter() {
        client.send_ws_msg(message.clone()).ok();
    }
    Ok(())
}

/// Broadcast to all connected clients except the excluded client.
pub(super) async fn broadcast_all_except(
    concierge: &Concierge,
    payload: &impl Serialize,
    excluded: Uuid,
) -> Result<(), WsError> {
    let message = Message::text(serde_json::to_string(&payload)?);
    let clients = concierge.clients.read().await;
    for (uuid, client) in clients.iter() {
        if *uuid == excluded {
            continue;
        }
        client.send_ws_msg(message.clone())?;
    }
    Ok(())
}

fn verify_name(name: &str) -> bool {
    name.chars().all(|c| c.is_alphanumeric() || c == '_')
}

struct IdentifyPackage {
    name: String,
    nickname: Option<String>,
    tags: Vec<String>,
}

pub struct SocketConnection {
    concierge: Arc<Concierge>,
}

impl SocketConnection {
    pub fn new(concierge: Arc<Concierge>) -> Self {
        Self { concierge }
    }

    /// Handle incoming TCP connections and upgrade them to a Websocket connection.
    pub async fn handle_socket_conn(
        self,
        mut socket: WebSocket,
        addr: SocketAddr,
    ) -> Result<(), WsError> {
        // Protocol: Expect a payload that identifies the client within 5 seconds.
        match Self::obtain_id(&mut socket).await {
            // Got the identification data successfully.
            Ok(id) => {
                debug!(
                    "Identification successful. (ip: {}, name: {})",
                    addr, id.name
                );
                let (uuid, rx) = self.make_client(id, &mut socket).await?;
                self.client_loop(uuid, rx, socket).await?;
                self.remove_client(uuid).await?;
                Ok(())
            }
            // Failure: send close code to the client and drop the connection.
            Err(close_reason) => {
                warn!(
                    "Client failed to identify. (ip: {}, reason: {})",
                    addr, close_reason.reason
                );
                socket
                    .send(Message::close_with(close_reason.code, close_reason.reason))
                    .await?;
                Ok(socket.close().await?)
            }
        }
    }

    /// Handle the first 5 seconds of identification.
    async fn obtain_id(socket: &mut WebSocket) -> Result<IdentifyPackage, CloseReason<'static>> {
        // Protocol: Expect a payload that identifies the client within 5 seconds.
        if let Ok(Some(Ok(msg))) = timeout(Duration::from_secs(5), socket.next()).await {
            if let Ok(string) = msg.to_str() {
                match serde_json::from_str::<JsonPayload>(string) {
                    Ok(JsonPayload::Identify {
                        name,
                        nickname,
                        version,
                        secret,
                        tags,
                    }) => {
                        // name must be alphanumeric
                        if !verify_name(name) {
                            return Err(CloseReason::BAD_AUTH);
                        }
                        // check for secret
                        if secret != crate::SECRET {
                            return Err(CloseReason::BAD_SECRET);
                        }
                        // check that version matches (might need some work)
                        if !crate::min_version_req().matches(&Version::parse(version).unwrap()) {
                            return Err(CloseReason::BAD_VERSION);
                        }
                        // Convert the tags to owned
                        let tags = tags.iter().map(|s| s.to_string()).collect();

                        Ok(IdentifyPackage {
                            name: name.to_owned(),
                            nickname: nickname.map(ToOwned::to_owned),
                            tags,
                        })
                    }
                    Ok(_) => Err(CloseReason::NO_AUTH),
                    Err(err) => Err(CloseReason::FATAL_DECODE.with_reason(err.to_string())),
                }
            } else {
                Err(CloseReason::FATAL_DECODE)
            }
        } else {
            Err(CloseReason::AUTH_FAILED)
        }
    }

    /// Create a new client.
    async fn make_client(
        &self,
        id: IdentifyPackage,
        socket: &mut WebSocket,
    ) -> Result<(Uuid, UnboundedReceiver<Message>), WsError> {
        // Acquire a write lock to prevent race condition
        let mut namespace = self.concierge.namespace.write().await;
        // Duplicate identification, close the stream.
        if namespace.contains_key(&id.name) {
            warn!(
                "User attempted to join with existing id. (name: {})",
                id.name
            );
            socket
                .send(Message::close_with(
                    CloseReason::DUPLICATE_AUTH.code,
                    CloseReason::DUPLICATE_AUTH.reason,
                ))
                .await?;
            return Err(WsError::DuplicateName);
        }

        // Handle new client
        let uuid = Uuid::new_v4();
        // Add to namespace
        namespace.insert(id.name.clone(), uuid);
        drop(namespace);
        // Create the client struct
        let mut client = Client::new(uuid, id.name, id.nickname, id.tags);
        let rx = client.take_rx().unwrap();

        broadcast_all(
            &self.concierge,
            &JsonPayload::Status {
                data: StatusPayload::ClientJoined {
                    client: client.make_payload(),
                },
            },
        )
        .await?;

        self.concierge.clients.write().await.insert(uuid, client);

        Ok((uuid, rx))
    }

    /// Handle new client WebSocket connections.
    async fn client_loop(
        &self,
        client_uuid: Uuid,
        rx: UnboundedReceiver<Message>,
        socket: WebSocket,
    ) -> Result<(), WsError> {
        // This is the WebSocket channels for messages.
        // incoming: where we receive messages
        // outgoing: where the websocket send messages
        let (outgoing, incoming) = socket.split();
        // Have the client handle incoming messages.
        let incoming_loop = self.incoming_loop(client_uuid, incoming);
        // Forward our sent messages (from tx) to the outgoing sink.
        // This is because the client acts upon channels and doesn't know what the websocket is.
        let outgoing_loop = rx.map(Ok).forward(outgoing);

        // Setup complete, send the Hello payload.
        self.concierge
            .clients
            .read()
            .await
            .get(&client_uuid)
            .unwrap()
            .send(&JsonPayload::Hello {
                uuid: client_uuid,
                version: crate::VERSION,
            })?;

        // Irrelevant implementation detail: pinning prevents pointer invalidation
        pin_mut!(incoming_loop, outgoing_loop);
        // Select waits for the first task to complete: in this case, its whether
        // the stream `receive_from_others` end or `broadcast_incoming` end first,
        // which indicates that the client connection is dead.
        future::select(incoming_loop, outgoing_loop).await;
        Ok(())
    }

    /// Remove the client from the self.concierge.
    async fn remove_client(&self, client_uuid: Uuid) -> Result<(), WsError> {
        // Connection has been destroyed by this stage.
        info!("Client disconnected. (id: {})", client_uuid);
        let client = self.concierge.remove_client(client_uuid).await?;

        // Broadcast leave
        broadcast_all(
            &self.concierge,
            &JsonPayload::Status {
                data: StatusPayload::ClientLeft {
                    client: client.make_payload(),
                },
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
    async fn incoming_loop<E>(
        &self,
        uuid: Uuid,
        mut incoming: impl Stream<Item = Result<Message, E>> + Unpin,
    ) -> Result<(), WsError> {
        let mut seq = 0;
        while let Some(Ok(message)) = incoming.next().await {
            if let Ok(string) = message.to_str() {
                // Try to use the more efficient message format first.
                // The raw format does not attempt to deserialize the "data" field,
                // so we save on CPU cycles.
                if let Ok(
                    payload
                    @
                    PayloadRawMessage {
                        r#type: "MESSAGE", ..
                    },
                ) = serde_json::from_str(string)
                {
                    if let Err(err) = self.handle_raw_message(uuid, seq, payload).await {
                        let clients = self.concierge.clients.read().await;
                        let client = clients.get(&uuid).unwrap();
                        // Ignore, don't panic and die
                        client.send(&err::internal(&err.to_string()).seq(seq)).ok();
                    }
                } else {
                    match serde_json::from_str::<JsonPayload>(string) {
                        Ok(payload) => {
                            if let Err(err) = self.handle_payload(uuid, seq, payload).await {
                                let clients = self.concierge.clients.read().await;
                                let client = clients.get(&uuid).unwrap();
                                // Ignore, don't panic and die
                                client.send(&err::internal(&err.to_string()).seq(seq)).ok();
                            }
                        }
                        Err(err) => {
                            let clients = self.concierge.clients.read().await;
                            let client = clients.get(&uuid).unwrap();
                            // Ignore, don't panic and die
                            client.send(&err::protocol(&err.to_string()).seq(seq)).ok();
                        }
                    }
                }
                seq += 1;
            }
        }

        Ok(())
    }

    /// Handles incoming JSON payloads.
    async fn handle_payload(
        &self,
        client_uuid: Uuid,
        seq: usize,
        payload: JsonPayload<'_>,
    ) -> Result<(), WsError> {
        let clients = self.concierge.clients.read().await;
        let client = clients.get(&client_uuid).unwrap();

        match payload {
            Payload::Message { target, data, .. } => {
                warn!("Concierge attempted the slow message path!");
                // This is a fallback path. It's somewhat important that this path is
                // never used since it means that the server is deserializing the irrelevant data,
                // which takes up CPU cycles. If this path runs, it is most likely that the
                // structure of PayloadRawMessage does not match the structure of Payload::Message.
                // In that case, you should fix that.
                drop(clients);
                let data = serde_json::value::to_raw_value(&data)?;
                self.handle_raw_message(client_uuid, seq, PayloadRawMessage::new(target, &data))
                    .await?
            }
            Payload::SelfSubscribe { name } => {
                if let Some(group_payload) = client.subscribe(&self.concierge, name).await {
                    client.send(&ok::subscribed(group_payload).seq(seq))?;
                } else {
                    client.send(&err::no_such_group(name).seq(seq))?;
                }
            }
            Payload::SelfUnsubscribe { name } => {
                if let Some(group_payload) = client.unsubscribe(&self.concierge, name).await {
                    client.send(&ok::unsubscribed(group_payload).seq(seq))?;
                } else {
                    client.send(&err::no_such_group(name).seq(seq))?;
                }
            }
            Payload::GroupCreate { name, nickname } => {
                match self
                    .concierge
                    .create_group(name, nickname, client_uuid)
                    .await?
                {
                    Ok(group) => {
                        let created_result = ok::created_group(group);
                        self.concierge.broadcast_all_except(&created_result, client_uuid)
                            .await?;
                        client.send(&created_result.seq(seq))?;
                    }
                    Err(group) => {
                        client.send(&err::group_already_created(group).seq(seq))?;
                    }
                }
            }
            Payload::GroupDelete { name } => {
                if let Some(group) = self.concierge.remove_group(name, client.uuid()).await? {
                    let delete_result = ok::deleted_group(group.make_payload());
                    self.concierge.broadcast_all_except(&delete_result, group.owner_uuid)
                        .await?;
                    client.send(&delete_result.seq(seq))?;
                } else {
                    client.send(&err::no_such_group(name).seq(seq))?;
                }
            }
            Payload::GroupFetch { name } => {
                if let Some(group) = self.concierge.groups.read().await.get(name) {
                    client.send(&JsonPayload::GroupFetchResult {
                        group: group.make_payload(),
                    }.seq(seq))?;
                } else {
                    client.send(&err::no_such_group(name).seq(seq))?;
                }
            }
            Payload::ClientFetchAll => {
                let clients = clients
                    .values()
                    .map(Client::make_payload)
                    .collect::<Vec<_>>();
                client.send(&JsonPayload::ClientFetchAllResult { clients }.seq(seq))?;
            }
            Payload::GroupFetchAll => {
                let groups = self.concierge.groups.read().await;
                let group_payloads = groups.values().map(Group::make_payload).collect();
                client.send(
                    &JsonPayload::GroupFetchAllResult {
                        groups: group_payloads,
                    }
                    .seq(seq),
                )?;
            }
            Payload::SelfFetch => {
                let subscriptions = client.subscriptions.read().await;
                let groups = self.concierge.groups.read().await;
                let group_payloads = subscriptions
                    .iter()
                    .filter_map(|id| groups.get(id))
                    .map(Group::make_payload)
                    .collect::<Vec<_>>();
                client.send(
                    &JsonPayload::SelfFetchResult {
                        client: client.make_payload(),
                        subscriptions: group_payloads,
                    }
                    .seq(seq),
                )?
            }
            _ => client.send(&err::unsupported().seq(seq))?,
        }
        Ok(())
    }

    /// Handles raw message payloads.
    async fn handle_raw_message(
        &self,
        client_uuid: Uuid,
        seq: usize,
        payload: PayloadRawMessage<'_>,
    ) -> Result<(), WsError> {
        let clients = self.concierge.clients.read().await;
        let client = clients.get(&client_uuid).unwrap();
        let client_payload = client.make_payload();
        match payload.target {
            Target::Name { name } => {
                if let Some(target_client) = self
                    .concierge
                    .namespace
                    .read()
                    .await
                    .get(name)
                    .and_then(|id| clients.get(&id))
                {
                    target_client.send(&payload.with_origin(client_payload.to_origin()))?;
                    client.send(&ok::message_sent().seq(seq))
                } else {
                    client.send(&err::no_such_name(name).seq(seq))
                }
            }
            Target::Uuid { uuid } => {
                if let Some(target_client) = clients.get(&uuid) {
                    target_client.send(&payload.with_origin(client_payload.to_origin()))?;
                    client.send(&ok::message_sent().seq(seq))
                } else {
                    client.send(&err::no_such_uuid(uuid).seq(seq))
                }
            }
            Target::Group { group } => {
                if let Some(group) = self.concierge.groups.read().await.get(group) {
                    let origin = client_payload.to_origin().with_group(group.make_payload());
                    group
                        .broadcast(&self.concierge, &payload.with_origin(origin))
                        .await?;
                    client.send(&ok::message_sent().seq(seq))
                } else {
                    client.send(&err::no_such_group(group).seq(seq))
                }
            }
            Target::All => {
                broadcast_all(
                    &self.concierge,
                    &payload.with_origin(client_payload.to_origin()),
                )
                .await?;
                client.send(&ok::message_sent().seq(seq))
            }
        }
    }
}
