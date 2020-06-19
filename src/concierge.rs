use crate::payload::{IdentifyData, Payload};

use anyhow::{anyhow, Result};
use dashmap::DashMap;
use futures::{future, pin_mut, stream::TryStreamExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tokio::{net::TcpStream, time::timeout};
use tokio_tungstenite::{
    tungstenite::protocol::{frame::coding::CloseCode, CloseFrame, Message},
    WebSocketStream,
};

use flume::{unbounded, Sender};

pub struct Client {
    /// Client id.
    id: String,
    /// Client address.
    addr: SocketAddr,
    /// Sender channel.
    tx: Sender<Message>,
}

#[derive(Serialize, Deserialize, Copy, Clone)]
pub enum ClientType {
    PLUGIN,
    USER,
}

impl Client {
    /// Create a new client.
    fn new(id: String, addr: SocketAddr, tx: Sender<Message>) -> Self {
        Self { id, addr, tx }
    }

    /// Send a payload.
    fn send(&self, payload: Payload) -> Result<()> {
        self.tx
            .send(Message::binary(serde_json::to_vec(&payload)?))
            .map_err(|_| anyhow!("Send error"))
    }

    /// Send a WebSocket message.
    fn send_ws_msg(&self, msg: Message) -> Result<()> {
        self.tx.send(msg).map_err(|_| anyhow!("Send error"))
    }
}

type ClientTable = DashMap<String, Client>;

pub struct Concierge {
    /// Users map.
    users: ClientTable,
    /// Plugins map.
    plugins: ClientTable,
}

impl Concierge {
    /// Creates a new server.
    pub fn new() -> Self {
        Self {
            users: DashMap::new(),
            plugins: DashMap::new(),
        }
    }

    pub async fn handle_connection(
        self: Arc<Concierge>,
        raw_stream: TcpStream,
        addr: SocketAddr,
    ) -> Result<()> {
        println!("Incoming TCP connection. (addr: {})", addr);

        // Transform a raw TcpStream into a WebSocketStream.
        let mut ws_stream = tokio_tungstenite::accept_async(raw_stream)
            .await
            .expect("Error during the websocket handshake occurred");
        println!("WebSocket connection established (addr: {})", addr);

        // Protocol: Expect a payload that identifies the client within 5 seconds.
        match Self::handle_identification(&mut ws_stream).await {
            // Got the identification data successfully.
            Ok(data) => {
                println!("Identification successful. (addr: {})", addr);
                self.handle_client(data.t, addr, data.id, ws_stream).await
            }
            // Failure: send close code to the client and drop the connection.
            Err(close_code) => {
                println!(
                    "Client failed to identify properly or in time. (addr: {})",
                    addr
                );
                Ok(ws_stream
                    .close(Some(CloseFrame {
                        code: CloseCode::Library(close_code),
                        reason: "Identification failed".into(),
                    }))
                    .await?)
            }
        }
    }

    /// Handle the first 5 seconds of identification.
    async fn handle_identification(
        ws_stream: &mut WebSocketStream<TcpStream>,
    ) -> Result<IdentifyData, u16> {
        // Protocol: Expect a payload that identifies the client within 5 seconds.
        if let Ok(Some(Ok(msg))) = timeout(Duration::from_secs(5), ws_stream.next()).await {
            if let Some(Payload::Identify { data }) = msg
                .to_text()
                .ok()
                .and_then(|s| serde_json::from_str::<Payload>(s).ok())
            {
                return Ok(data);
            } else {
                return Err(4003); // sent prior to identification
            }
        }
        Err(4004) // authorization failed
    }

    /// Handle new client WebSocket connections.
    async fn handle_client(
        self: Arc<Concierge>,
        t: ClientType,
        addr: SocketAddr,
        id: String,
        ws_stream: WebSocketStream<TcpStream>,
    ) -> Result<()> {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded();

        let client = Client::new(id.clone(), addr, tx);
        client.send(Payload::Hello)?;
        let map = match t {
            ClientType::USER => &self.users,
            ClientType::PLUGIN => &self.plugins
        };

        if map.contains_key(&id) {
            client.send_ws_msg(Message::Close(Some(CloseFrame {
                code: CloseCode::Library(3),
                reason: "Identification failed".into(),
            })))?;
            return Ok(());
        } else {
            map.insert(id.clone(), client);
        }

        // This is the WebSocket channels for messages.
        // incoming: where we receive messages
        // outgoing: where the websocket send messages
        let (outgoing, incoming) = ws_stream.split();

        // Handle incoming messages
        let incoming_handler = incoming.map_err(|e| e.into()).try_for_each(|msg| {
            println!("Received a message (id: {}): {:?}", &id, msg.to_text());

            let client = match t {
                ClientType::USER => self.users.get(&id),
                ClientType::PLUGIN => self.plugins.get(&id),
            }
            .unwrap();

            if let Ok(payload) = serde_json::from_slice::<Payload>(&msg.into_data()) {
                let result = match payload {
                    Payload::Message {
                        target_type,
                        target,
                        data,
                        ..
                    } => {
                        if let Some(target_client) = match target_type {
                            ClientType::USER => self.users.get(target),
                            ClientType::PLUGIN => self.plugins.get(target),
                        } {
                            // Relay the message and rewrite the origin fields.
                            target_client.send(Payload::Message {
                                origin_type: Some(t),
                                origin: Some(&id),
                                target_type,
                                target,
                                data,
                            })
                        } else {
                            client.send(Payload::Error {
                                code: 4005,
                                data: "Invalid target",
                            })
                        }
                    }
                    Payload::FetchPlugins => {
                        let data = self
                            .plugins
                            .iter()
                            .map(|e| e.key().to_owned())
                            .collect::<Vec<_>>();
                        client.send(Payload::PluginsData { data })
                    }
                    Payload::FetchUsers => {
                        let data = self
                            .users
                            .iter()
                            .map(|e| e.key().to_owned())
                            .collect::<Vec<_>>();
                        client.send(Payload::UsersData { data })
                    }
                    _ => Ok(()),
                };
                future::ready(result)
            } else {
                future::ok(())
            }
        });

        // Forward our sent messages (from tx) to the outgoing sink.
        let receive_from_others = rx
            .map(|z| {
                println!(
                    "Sending to (id: {}), {}",
                    &id,
                    z.to_text().unwrap_or("Unable to decode message")
                );
                Ok(z)
            })
            .forward(outgoing);

        // Irrelevant implementation detail: pinning prevents pointer invalidation
        pin_mut!(incoming_handler, receive_from_others);
        // Select waits for the first task to complete: in this case, its whether
        // the stream `receive_from_others` end or `broadcast_incoming` end first,
        // which indicates that the client connection is dead.
        future::select(incoming_handler, receive_from_others).await;

        // Connection has been destroyed by this stage.
        println!("Client disconnected. (ip: {}, id: {})", &addr, &id);
        self.users.remove(&id);

        Ok(())
    }
}
