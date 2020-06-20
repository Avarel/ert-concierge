use crate::payload::{
    error_payloads,
    Payload, TargetData,
};
use anyhow::{anyhow, Result};
use futures::{Stream, StreamExt};
use serde::{Deserialize, Serialize};
use warp::ws::Message;

use crate::concierge::Concierge;
use flume::{unbounded, Receiver, Sender};

pub struct Client {
    /// Client id.
    id: String,
    /// Client type.
    client_type: ClientType,
    /// Sender channel.
    tx: Sender<Message>,
}

#[derive(Serialize, Deserialize, Copy, Clone, Eq, PartialEq, Hash)]
pub enum ClientType {
    PLUGIN,
    USER,
}

impl Client {
    /// Create a new client.
    pub fn new(id: String, client_type: ClientType) -> (Self, Receiver<Message>) {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded();
        (
            Self {
                id,
                client_type,
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
                        Payload::Message {
                            target,
                            data,
                            ..
                        } => {
                            if let Some(target_client) =
                                server.clients.get(&target.t).unwrap().get(target.id)
                            {
                                // Relay the message and rewrite the origin fields.
                                target_client.send(Payload::Message {
                                    origin: Some(TargetData { t: self.client_type, id: &self.id }),
                                    target,
                                    data,
                                })?;
                            } else {
                                self.send(error_payloads::INVALID_TARGET)?;
                            }
                        }
                        Payload::FetchClients { client_type } => {
                            let data = server
                                .clients
                                .get(&client_type)
                                .unwrap()
                                .iter()
                                .map(|e| e.key().to_owned())
                                .collect::<Vec<_>>();
                            self.send(Payload::ClientsData { client_type, data })?;
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
