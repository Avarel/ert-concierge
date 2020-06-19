use crate::{
    clients::{Client, ClientType},
    payload::{IdentifyData, Payload},
};

use anyhow::Result;
use dashmap::DashMap;
use futures::{future, pin_mut, stream::TryStreamExt, Sink, SinkExt, StreamExt};
use log::{debug, info, warn};
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tokio::{net::TcpStream, time::timeout};
use tokio_tungstenite::{
    tungstenite::protocol::{frame::coding::CloseCode, CloseFrame, Message},
    WebSocketStream,
};

use flume::Receiver;

type ClientTable = DashMap<String, Client>;

pub struct Concierge {
    pub clients: DashMap<ClientType, ClientTable>,
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
    pub fn broadcast(&self, client_type: ClientType, payload: Payload) -> Result<()> {
        let message = Message::text(serde_json::to_string(&payload)?);
        for client in self.clients.get(&client_type).unwrap().iter() {
            client.send_ws_msg(message.clone())?;
        }
        Ok(())
    }

    /// Handle incoming TCP connections and upgrade them to a Websocket connection.
    pub async fn handle_connection(
        self: Arc<Self>,
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
                ws_stream
                    .close(Some(CloseFrame {
                        code: CloseCode::Library(close_code),
                        reason: "Identification failed".into(),
                    }))
                    .await?;
                Ok(())
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
        self: Arc<Self>,
        client_type: ClientType,
        addr: SocketAddr,
        id: String,
        mut ws_stream: WebSocketStream<TcpStream>,
    ) -> Result<()> {
        let clients = self.clients.get(&client_type).unwrap();
        // Duplicate identification, close the stream.
        if clients.contains_key(&id) {
            warn!(
                "User attempted to join with existing id. (ip: {}, id: {})",
                addr, id
            );
            ws_stream
                .close(Some(CloseFrame {
                    code: CloseCode::Library(4001),
                    reason: "Identification failed".into(),
                }))
                .await?;
            return Ok(());
        }

        let (client, rx) = Client::new(id.clone(), client_type, addr);
        let client = clients.insert_and_get(id.clone(), client);

        info!("New client joined. (ip: {}, id: {})", addr, id);

        // This is the WebSocket channels for messages.
        // incoming: where we receive messages
        // outgoing: where the websocket send messages
        let (outgoing, incoming) = ws_stream.split();

        // Have the client handle incoming messages.
        let incoming_handler =
            client.handle_incoming_messages(&self, incoming.map_err(|e| e.into()));
        // Forward our sent messages (from tx) to the outgoing sink.
        // This is because the client acts upon channels and doesn't know what the websocket is.
        let receive_from_others =
            Self::forward_message(&id, rx, outgoing.sink_map_err(|e| e.into()));

        // Setup complete, send the Hello payload.
        client.send(Payload::Hello)?;

        // Irrelevant implementation detail: pinning prevents pointer invalidation
        pin_mut!(incoming_handler, receive_from_others);
        // Select waits for the first task to complete: in this case, its whether
        // the stream `receive_from_others` end or `broadcast_incoming` end first,
        // which indicates that the client connection is dead.
        future::select(incoming_handler, receive_from_others).await;

        // Connection has been destroyed by this stage.
        info!("Client disconnected. (ip: {}, id: {})", &addr, &id);
        self.clients.get(&client_type).unwrap().remove(&id);

        Ok(())
    }

    /// Forward messages from a client's receiver to the websocket outgoing stream.
    async fn forward_message(
        id: &str,
        mut rx: Receiver<Message>,
        mut outgoing: impl Sink<Message, Error = anyhow::Error> + Unpin,
    ) -> Result<()> {
        while let Some(message) = rx.next().await {
            if let Message::Text(ref string) = message {
                debug!("Sending text (id: {}): {}", &id, string);
            } else if let Message::Binary(ref bin) = message {
                debug!("Sending binary (id: {}): bin length = {}", &id, bin.len())
            }
            outgoing.send(message).await?;
        }
        Ok(())
    }
}
