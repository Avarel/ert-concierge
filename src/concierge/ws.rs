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
use std::{borrow::Cow, net::SocketAddr, path::Path, time::Duration};
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

pub struct SocketConnection<'a> {
    pub concierge: &'a Concierge,
}

impl SocketConnection<'_> {
    /// Handle incoming TCP connections and upgrade them to a Websocket connection.
    pub async fn handle_socket_conn(
        &self,
        mut socket: WebSocket,
        addr: SocketAddr,
    ) -> Result<(), WsError> {
        // Protocol: Expect a payload that identifies the client within 5 seconds.
        match Self::handle_identification(&mut socket).await {
            // Got the identification data successfully.
            Ok(id) => {
                debug!(
                    "Identification successful. (ip: {}, name: {})",
                    addr, id.name
                );
                let (uuid, rx) = self.make_client(id, &mut socket).await?;
                self.handle_client(uuid, rx, socket).await?;
                self.remove_client(uuid).await?;
                Ok(())
            }
            // Failure: send close code to the client and drop the connection.
            Err(close_reason) => {
                warn!(
                    "Client failed to identify properly or in time. (ip: {})",
                    addr
                );
                socket
                    .send(Message::close_with(close_reason.code, close_reason.reason))
                    .await?;
                Ok(socket.close().await?)
            }
        }
    }

    /// Handle the first 5 seconds of identification.
    async fn handle_identification(
        socket: &mut WebSocket,
    ) -> Result<IdentifyPackage, CloseReason<'static>> {
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
            socket.close().await?;
            return Err(WsError::DuplicateName);
        }

        // Handle new client
        let uuid = Uuid::new_v4();
        // Add to namespace
        namespace.insert(id.name.clone(), uuid);
        drop(namespace);
        // Create the client struct
        let (client, rx) = Client::new(uuid, id.name, id.nickname, id.tags);

        broadcast_all(
            self.concierge,
            &JsonPayload::Status {
                seq: None,
                data: StatusPayload::ClientJoined {
                    data: client.make_payload(),
                },
            },
        )
        .await?;

        self.concierge.clients.write().await.insert(uuid, client);

        Ok((uuid, rx))
    }

    /// Handle new client WebSocket connections.
    async fn handle_client(
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
        let outgoing_loop = rx
            .map(Ok)
            .forward(outgoing);

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
        // let client = self.concierge.clients.get(&client_uuid).unwrap();
        // let client_name = client.name();
        // let origin_receipt = client.origin_receipt();

        // Connection has been destroyed by this stage.
        info!("Client disconnected. (id: {})", client_uuid);
        let client = self.concierge.remove_client(client_uuid).await?;

        // Broadcast leave
        broadcast_all(
            self.concierge,
            &JsonPayload::Status {
                seq: None,
                data: StatusPayload::ClientLeft {
                    data: client.make_payload(),
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
                        client.send(&err::internal(seq, &err.to_string())).ok();
                    }
                } else {
                    match serde_json::from_str::<JsonPayload>(string) {
                        Ok(payload) => {
                            if let Err(err) = self.handle_payload(uuid, seq, payload).await {
                                let clients = self.concierge.clients.read().await;
                                let client = clients.get(&uuid).unwrap();
                                // Ignore, don't panic and die
                                client.send(&err::internal(seq, &err.to_string())).ok();
                            }
                        }
                        Err(err) => {
                            let clients = self.concierge.clients.read().await;
                            let client = clients.get(&uuid).unwrap();
                            // Ignore, don't panic and die
                            client.send(&err::protocol(seq, &err.to_string())).ok();
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
                // which takes up CPU cycles.
                drop(clients);
                let data = serde_json::value::to_raw_value(&data)?;
                self.handle_raw_message(client_uuid, seq, PayloadRawMessage::new(target, &data))
                    .await?
            }
            Payload::Subscribe { group: group_name } => {
                if client.subscribe(self.concierge, group_name).await {
                    client.send(&ok::subscribed(seq, group_name))?;
                } else {
                    client.send(&err::no_such_group(seq, group_name))?;
                }
            }
            Payload::Unsubscribe { group: group_name } => {
                if client.unsubscribe(self.concierge, group_name).await {
                    client.send(&ok::unsubscribed(Some(seq), group_name))?;
                } else {
                    client.send(&err::no_such_group(seq, group_name))?;
                }
            }
            Payload::GroupCreate { group } => {
                if self.concierge.create_group(group, client_uuid).await? {
                    client.send(&ok::created_group(Some(seq), group))?;
                } else {
                    client.send(&err::group_already_created(seq, group))?;
                }
            }
            Payload::GroupDelete { group } => {
                if self.concierge.remove_group(group, client.uuid()).await? {
                    client.send(&ok::deleted_group(Some(seq), group))?;
                } else {
                    client.send(&err::no_such_group(seq, group))?;
                }
            }
            Payload::FetchGroup { group } => {
                if let Some(group) = self.concierge.groups.read().await.get(group) {
                    let owner = clients.get(&group.owner).ok_or(WsError::Internal)?;
                    let clients = group
                        .clients
                        .iter()
                        .filter_map(|uuid| clients.get(uuid))
                        .map(Client::make_payload)
                        .collect::<Vec<_>>();
                    client.send(&JsonPayload::Group {
                        group: &group.name,
                        owner: owner.make_payload(),
                        clients,
                    })?;
                } else {
                    client.send(&err::no_such_group(seq, group))?;
                }
            }
            Payload::FetchGroupSubscribers { group } => {
                if let Some(group) = self.concierge.groups.read().await.get(group) {
                    let clients = group
                        .clients
                        .iter()
                        .filter_map(|uuid| clients.get(uuid))
                        .map(Client::make_payload)
                        .collect::<Vec<_>>();
                    client.send(&JsonPayload::GroupSubscribers {
                        group: &group.name,
                        clients,
                    })?;
                } else {
                    client.send(&err::no_such_group(seq, group))?;
                }
            }
            Payload::FetchClients => {
                let clients = clients
                    .values()
                    .map(Client::make_payload)
                    .collect::<Vec<_>>();
                client.send(&JsonPayload::Clients { clients })?;
            }
            Payload::FetchGroups => {
                let groups = self.concierge.groups.read().await;
                let group_names = groups
                    .keys()
                    .map(String::as_str)
                    .map(Cow::Borrowed)
                    .collect();
                client.send(&JsonPayload::Groups {
                    groups: group_names,
                })?;
            }
            Payload::FetchSubscriptions => {
                let groups = client.subscriptions.read().await;
                let group_names = groups
                    .iter()
                    .map(String::as_str)
                    .map(Cow::Borrowed)
                    .collect::<Vec<_>>();
                client.send(&JsonPayload::Subscriptions {
                    groups: group_names,
                })?
            }
            _ => client.send(&err::unsupported(seq))?,
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
                    client.send(&ok::message_sent(seq))
                } else {
                    client.send(&err::no_such_name(seq, name))
                }
            }
            Target::Uuid { uuid } => {
                if let Some(target_client) = clients.get(&uuid) {
                    target_client.send(&payload.with_origin(client_payload.to_origin()))?;
                    client.send(&ok::message_sent(seq))
                } else {
                    client.send(&err::no_such_uuid(seq, uuid))
                }
            }
            Target::Group { group } => {
                if let Some(group) = self.concierge.groups.read().await.get(group) {
                    let origin = client_payload.to_origin().with_group(&group.name);
                    group
                        .broadcast(self.concierge, &payload.with_origin(origin))
                        .await?;
                    client.send(&ok::message_sent(seq))
                } else {
                    client.send(&err::no_such_group(seq, group))
                }
            }
            Target::All => {
                broadcast_all(
                    self.concierge,
                    &payload.with_origin(client_payload.to_origin()),
                )
                .await?;
                client.send(&ok::message_sent(seq))
            }
        }
    }
}
