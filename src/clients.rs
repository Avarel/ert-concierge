use crate::payload::{
    Payload, ERROR_PAYLOAD_DECODE, ERROR_PAYLOAD_INVALID_TARGET, ERROR_PAYLOAD_UNSUPPORTED,
};
use anyhow::{anyhow, Result};
use futures::{Stream, StreamExt};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, sync::Arc};
use tokio_tungstenite::tungstenite::protocol::Message;

use crate::concierge::Concierge;
use flume::{unbounded, Receiver, Sender};

pub struct Client {
    /// Client id.
    id: String,
    /// Client type.
    client_type: ClientType,
    /// Client address.
    addr: SocketAddr,
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
    pub fn new(id: String, client_type: ClientType, addr: SocketAddr) -> (Self, Receiver<Message>) {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded();
        (
            Self {
                id,
                client_type,
                addr,
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
        server: &Arc<Concierge>,
        mut incoming: impl Stream<Item = Result<Message>> + Unpin,
    ) -> Result<()> {
        while let Some(Ok(msg)) = incoming.next().await {
            match msg {
                Message::Text(ref string) => {
                    if let Ok(payload) = serde_json::from_str::<Payload>(string) {
                        match payload {
                            Payload::Message {
                                target_type,
                                target,
                                data,
                                ..
                            } => {
                                if let Some(target_client) =
                                    server.clients.get(&target_type).unwrap().get(target)
                                {
                                    // Relay the message and rewrite the origin fields.
                                    target_client.send(Payload::Message {
                                        origin_type: Some(self.client_type),
                                        origin: Some(&self.id),
                                        target_type,
                                        target,
                                        data,
                                    })?;
                                } else {
                                    self.send(ERROR_PAYLOAD_INVALID_TARGET)?;
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
                            _ => self.send(ERROR_PAYLOAD_UNSUPPORTED)?,
                        }
                    } else {
                        self.send(ERROR_PAYLOAD_DECODE)?;
                    }
                }
                Message::Binary(_) => {
                    self.send(ERROR_PAYLOAD_UNSUPPORTED)?;
                }
                _ => {}
            }
        }

        Ok(())
    }
}
