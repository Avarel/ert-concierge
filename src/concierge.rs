use crate::payload::{IdentifyData, Payload};

use anyhow::{anyhow, Result};
use dashmap::DashMap;
use futures::{future, pin_mut, stream::TryStreamExt, Sink, SinkExt, Stream, StreamExt};
use log::{debug, info, warn};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tokio::{net::TcpStream, time::timeout};
use tokio_tungstenite::{
    tungstenite::protocol::{frame::coding::CloseCode, CloseFrame, Message},
    WebSocketStream,
};

use flume::{unbounded, Receiver, Sender};

pub struct Client {
    /// Client id.
    id: String,
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
    fn new(id: String, addr: SocketAddr, tx: Sender<Message>) -> Self {
        Self { id, addr, tx }
    }

    /// Send a payload.
    fn send(&self, payload: Payload) -> Result<()> {
        self.send_ws_msg(Message::binary(serde_json::to_vec(&payload)?))
    }

    /// Send a WebSocket message.
    fn send_ws_msg(&self, msg: Message) -> Result<()> {
        self.tx.send(msg).map_err(|_| anyhow!("Send error"))
    }
}

type ClientTable = DashMap<String, Client>;

pub struct Concierge {
    clients: DashMap<ClientType, ClientTable>,
}

impl Concierge {
    /// Creates a new server.
    pub fn new() -> Self {
        let map = DashMap::new();
        map.insert(ClientType::PLUGIN, ClientTable::new());
        map.insert(ClientType::USER, ClientTable::new());
        Self { clients: map }
    }

    /// Broadcast a payload to all connected client of `client_type`.
    pub fn broadcast(
        self: Arc<Concierge>,
        client_type: ClientType,
        payload: Payload,
    ) -> Result<()> {
        let message = Message::binary(serde_json::to_vec(&payload)?);
        for client in self.clients.get(&client_type).unwrap().iter() {
            client.send_ws_msg(message.clone())?;
        }
        Ok(())
    }

    /// Handle incoming TCP connections and upgrade them to a Websocket connection.
    pub async fn handle_connection(
        self: Arc<Concierge>,
        raw_stream: TcpStream,
        addr: SocketAddr,
    ) -> Result<()> {
        debug!("Incoming TCP connection. (addr: {})", addr);

        // Transform a raw TcpStream into a WebSocketStream.
        let mut ws_stream = tokio_tungstenite::accept_async(raw_stream).await?;
        debug!("Websocket connection established. (ip: {})", addr);

        // Protocol: Expect a payload that identifies the client within 5 seconds.
        match Self::handle_identification(&mut ws_stream).await {
            // Got the identification data successfully.
            Ok(data) => {
                debug!("Identification successful. (ip: {})", addr);
                self.handle_client(data.t, addr, data.id, ws_stream).await
            }
            // Failure: send close code to the client and drop the connection.
            Err(close_code) => {
                warn!(
                    "Client failed to identify properly or in time. (ip: {})",
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
        let (tx, mut rx) = unbounded();

        let client = Client::new(id.clone(), addr, tx);
        client.send(Payload::Hello)?;
        let map = self.clients.get(&t).unwrap();

        if map.contains_key(&id) {
            // Duplicate identification, kick the user!
            client.send_ws_msg(Message::Close(Some(CloseFrame {
                code: CloseCode::Library(3),
                reason: "Identification failed".into(),
            })))?;
            warn!(
                "User attempted to join with existing identification. (ip: {}, id: {})",
                addr, id
            );
            return Ok(());
        } else {
            map.insert(id.clone(), client);
        }

        info!("New client joined. (ip: {}, id: {})", addr, id);

        // This is the WebSocket channels for messages.
        // incoming: where we receive messages
        // outgoing: where the websocket send messages
        let (mut outgoing, incoming) = ws_stream.split();

        let incoming_handler =
            self.handle_incoming_messages(t, id.clone(), incoming.map_err(|e| e.into()));
        // async {
        //     let client = self.clients.get(&t).unwrap().get(&id).unwrap();

        //     while let Some(Ok(msg)) = incoming.next().await {
        //         if let Ok(payload) = serde_json::from_slice::<Payload>(&msg.into_data()) {
        //             match payload {
        //                 Payload::Message {
        //                     target_type,
        //                     target,
        //                     data,
        //                     ..
        //                 } => {
        //                     if let Some(target_client) =
        //                         self.clients.get(&target_type).unwrap().get(target)
        //                     {
        //                         // Relay the message and rewrite the origin fields.
        //                         target_client.send(Payload::Message {
        //                             origin_type: Some(t),
        //                             origin: Some(&id),
        //                             target_type,
        //                             target,
        //                             data,
        //                         })?;
        //                     } else {
        //                         client.send(Payload::Error {
        //                             code: 4005,
        //                             data: "Invalid target",
        //                         })?;
        //                     }
        //                 }
        //                 Payload::FetchClients { client_type } => {
        //                     let data = self
        //                         .clients
        //                         .get(&client_type)
        //                         .unwrap()
        //                         .iter()
        //                         .map(|e| e.key().to_owned())
        //                         .collect::<Vec<_>>();
        //                     client.send(Payload::ClientsData { client_type, data })?;
        //                 }
        //                 _ => {}
        //             }
        //         } else {
        //             client.send(Payload::Error {
        //                 code: 4001,
        //                 data: "Unknown payload",
        //             })?;
        //         }
        //     }

        //     Ok::<(), anyhow::Error>(())
        // };

        // Handle incoming messages
        // let incoming_handler = incoming.map_err(|e| e.into()).try_for_each(|msg| {
        //     debug!("Received a message (id: {}): {:?}", &id, msg.to_text());

        //     let client = self.clients.get(&t).unwrap().get(&id).unwrap();

        //     future::ready(
        //         if let Ok(payload) = serde_json::from_slice::<Payload>(&msg.into_data()) {
        //             match payload {
        //                 Payload::Message {
        //                     target_type,
        //                     target,
        //                     data,
        //                     ..
        //                 } => {
        //                     if let Some(target_client) =
        //                         self.clients.get(&target_type).unwrap().get(target)
        //                     {
        //                         // Relay the message and rewrite the origin fields.
        //                         target_client.send(Payload::Message {
        //                             origin_type: Some(t),
        //                             origin: Some(&id),
        //                             target_type,
        //                             target,
        //                             data,
        //                         })
        //                     } else {
        //                         client.send(Payload::Error {
        //                             code: 4005,
        //                             data: "Invalid target",
        //                         })
        //                     }
        //                 }
        //                 Payload::FetchClients { client_type } => {
        //                     let data = self
        //                         .clients
        //                         .get(&client_type)
        //                         .unwrap()
        //                         .iter()
        //                         .map(|e| e.key().to_owned())
        //                         .collect::<Vec<_>>();
        //                     client.send(Payload::ClientsData { client_type, data })
        //                 }
        //                 _ => Ok(()),
        //             }
        //         } else {
        //             client.send(Payload::Error {
        //                 code: 4001,
        //                 data: "Unknown payload",
        //             })
        //         }
        //     )
        // });

        // Forward our sent messages (from tx) to the outgoing sink.
        let receive_from_others = Self::forward_message(id.clone(), rx, outgoing);
        // async {
        //     while let Some(m) = rx.next().await {
        //         debug!(
        //             "Sending message (ip: id: {}): {}",
        //             &id,
        //             m.to_text().unwrap_or("Unable to decode text")
        //         );
        //         outgoing.send(m).await?;
        //     }
        //     Ok::<(), anyhow::Error>(())
        // };
        
        //Self::forward_message(id.clone(), rx, outgoing);
        // let receive_from_others = rx
        //     .inspect(|m| {
        //         debug!(
        //             "Sending message (ip: id: {}): {}",
        //             &id,
        //             m.to_text().unwrap_or("Unable to decode text")
        //         )
        //     })
        //     .map(Ok)
        //     .forward(outgoing);

        // Irrelevant implementation detail: pinning prevents pointer invalidation
        pin_mut!(incoming_handler, receive_from_others);
        // Select waits for the first task to complete: in this case, its whether
        // the stream `receive_from_others` end or `broadcast_incoming` end first,
        // which indicates that the client connection is dead.
        future::select(incoming_handler, receive_from_others).await;

        // Connection has been destroyed by this stage.
        info!("Client disconnected. (ip: {}, id: {})", &addr, &id);
        self.clients.get(&t).unwrap().remove(&id);

        Ok(())
    }

    async fn handle_incoming_messages(
        self: &Arc<Concierge>,
        t: ClientType,
        id: String,
        mut incoming: impl Stream<Item = Result<Message>> + Unpin,
    ) -> Result<()> {
        let client = self.clients.get(&t).unwrap().get(&id).unwrap();

        while let Some(Ok(msg)) = incoming.next().await {
            if let Ok(payload) = serde_json::from_slice::<Payload>(&msg.into_data()) {
                match payload {
                    Payload::Message {
                        target_type,
                        target,
                        data,
                        ..
                    } => {
                        if let Some(target_client) =
                            self.clients.get(&target_type).unwrap().get(target)
                        {
                            // Relay the message and rewrite the origin fields.
                            target_client.send(Payload::Message {
                                origin_type: Some(t),
                                origin: Some(&id),
                                target_type,
                                target,
                                data,
                            })?;
                        } else {
                            client.send(Payload::Error {
                                code: 4005,
                                data: "Invalid target",
                            })?;
                        }
                    }
                    Payload::FetchClients { client_type } => {
                        let data = self
                            .clients
                            .get(&client_type)
                            .unwrap()
                            .iter()
                            .map(|e| e.key().to_owned())
                            .collect::<Vec<_>>();
                        client.send(Payload::ClientsData { client_type, data })?;
                    }
                    _ => {}
                }
            } else {
                client.send(Payload::Error {
                    code: 4001,
                    data: "Unknown payload",
                })?;
            }
        }

        Ok(())
    }

    async fn forward_message(
        id: String,
        mut rx: Receiver<Message>,
        mut outgoing: impl Sink<Message, Error = tokio_tungstenite::tungstenite::Error> + Unpin,
    ) -> Result<()> {
        while let Some(m) = rx.next().await {
            debug!(
                "Sending message (ip: id: {}): {}",
                &id,
                m.to_text().unwrap_or("Unable to decode text")
            );
            outgoing.send(m).await?;
        }
        Ok(())
    }
}
