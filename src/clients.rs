use crate::payload::{error_payloads, ClientData, Payload};
use anyhow::{anyhow, Result};
use futures::{Stream, StreamExt};
use serde::{Deserialize, Serialize};
use warp::ws::Message;

use crate::concierge::Concierge;
use flume::{unbounded, Receiver, Sender};
use uuid::Uuid;

pub struct Client {
    /// Client id.
    uuid: Uuid,
    /// Client name.
    name: String,
    /// Client type.
    group: ClientGroup,
    /// Sender channel.
    tx: Sender<Message>,
}

#[derive(Serialize, Deserialize, Copy, Clone, Eq, PartialEq, Hash)]
pub enum ClientGroup {
    PLUGIN,
    USER,
}

impl Client {
    /// Create a new client.
    pub fn new(uuid: Uuid, name: String, group: ClientGroup) -> (Self, Receiver<Message>) {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded();
        (
            Self {
                uuid,
                name,
                group,
                tx,
            },
            rx,
        )
    }

    /// Send a payload.
    pub fn send(&self, payload: Payload) -> Result<()> {
        self.send_ws_msg(Message::text(serde_json::to_string(&payload)?))
    }

    /// Send a WebSocket message.
    pub fn send_ws_msg(&self, msg: Message) -> Result<()> {
        self.tx.send(msg).map_err(|_| anyhow!("Send error"))
    }

    /// Handle incoming payloads with the client information.
    pub async fn handle_incoming_messages(
        &self,
        server: &Concierge,
        mut incoming: impl Stream<Item = Result<Message>> + Unpin,
    ) -> Result<()> {
        while let Some(Ok(message)) = incoming.next().await {
            if let Ok(string) = message.to_str() {
                if let Ok(payload) = serde_json::from_str::<Payload>(string) {
                    match payload {
                        Payload::MessageClient { target, data, .. } => {
                            if let Some(target_client) = server
                                .groups
                                .get(&target.group)
                                .unwrap()
                                .get(target.name)
                                .and_then(|id| server.clients.get(&id))
                            {
                                // Relay the message and rewrite the origin fields.
                                target_client.send(Payload::MessageClient {
                                    origin: Some(ClientData {
                                        group: self.group,
                                        name: &self.name,
                                    }),
                                    target,
                                    data,
                                })?;
                            } else {
                                self.send(error_payloads::INVALID_TARGET)?;
                            }
                        }
                        Payload::MessageUuid { target, data, .. } => {
                            if let Some(target_client) = server.clients.get(&target) {
                                target_client.send(Payload::MessageUuid {
                                    origin: Some(self.uuid),
                                    target,
                                    data,
                                })?;
                            }
                        }
                        Payload::BroadcastGroup { group, data, .. } => {
                            server.broadcast(group, Payload::BroadcastAll {
                                origin: Some(ClientData {
                                    group: self.group,
                                    name: &self.name,
                                }),
                                data
                            })?;
                        }
                        Payload::BroadcastAll { data, .. } => {
                            server.broadcast_all(Payload::BroadcastAll {
                                origin: Some(ClientData {
                                    group: self.group,
                                    name: &self.name,
                                }),
                                data
                            })?;
                        }
                        Payload::FetchClients { group } => {
                            let (names, uuids) = server
                                .groups
                                .get(&group)
                                .unwrap()
                                .iter()
                                .map(|e| (e.key().to_owned(), *e.value()))
                                .unzip();
                            self.send(Payload::ClientsDump {
                                group,
                                names,
                                uuids,
                            })?;
                        }
                        _ => self.send(error_payloads::UNSUPPORTED)?,
                    }
                } else {
                    self.send(error_payloads::PROTOCOL)?;
                }
            } else if message.is_ping() {
                self.send_ws_msg(Message::ping(vec![]))?;
            }
        }

        Ok(())
    }
}
