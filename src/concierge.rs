use crate::{
    clients::{Client, ClientType},
    payload::{
        close_codes,
        IdentifyData, Payload,
    },
};

use anyhow::{anyhow, Result};
use dashmap::DashMap;
use futures::{future, pin_mut, stream::TryStreamExt, Sink, SinkExt, StreamExt};
use log::{debug, info, warn};
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tokio::time::timeout;
use warp::ws::{Message, WebSocket};

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
}

impl Concierge {
    #[allow(dead_code)]
    /// Broadcast a payload to all connected client of `client_type`.
    pub fn broadcast(&self, client_type: ClientType, payload: Payload) -> Result<()> {
        let message = Message::text(serde_json::to_string(&payload)?);
        for client in self.clients.get(&client_type).unwrap().iter() {
            client.send_ws_msg(message.clone())?;
        }
        Ok(())
    }

    #[allow(dead_code)]
    /// Handle incoming TCP connections and upgrade them to a Websocket connection.
    pub async fn handle_new_socket(
        self: Arc<Self>,
        mut socket: WebSocket,
        addr: Option<SocketAddr>,
    ) -> Result<()> {
        if let Some(addr) = addr {
            // Protocol: Expect a payload that identifies the client within 5 seconds.
            match Self::handle_identification(&mut socket).await {
                // Got the identification data successfully.
                Ok(data) => {
                    debug!("Identification successful. (ip: {}, id: {})", addr, data.id);
                    Ok(self.handle_client(data.t, data.id.to_owned(), socket).await?)
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
        } else {
            socket.close().await?;
            Err(anyhow!("A client joined without any ip."))
        }
    }

    #[allow(dead_code)]
    /// Handle the first 5 seconds of identification.
    async fn handle_identification(socket: &mut WebSocket) -> Result<IdentifyData, u16> {
        // Protocol: Expect a payload that identifies the client within 5 seconds.
        if let Ok(Some(Ok(msg))) = timeout(Duration::from_secs(5), socket.next()).await {
            debug!("{:?}", msg);
            if let Ok(payload) = msg
                .to_str()
                .and_then(|s| serde_json::from_str::<Payload>(s).map_err(|_| ()))
            {
                if let Payload::Identify { data } = payload {
                    return Ok(data);
                } else {
                    return Err(close_codes::NO_AUTH);
                }
            } else {
                return Err(close_codes::FATAL_DECODE);
            }
        }
        Err(close_codes::AUTH_FAILED)
    }

    /// Handle new client WebSocket connections.
    async fn handle_client(
        self: Arc<Self>,
        client_type: ClientType,
        id: String,
        mut socket: WebSocket,
    ) -> Result<()> {
        let clients = self.clients.get(&client_type).unwrap();
        // Duplicate identification, close the stream.
        if clients.contains_key(&id) {
            warn!("User attempted to join with existing id. (id: {})", id);
            socket
                .send(Message::close_with(close_codes::DUPLICATE_AUTH, "Identification failed"))
                .await?;
            socket.close().await?;
            return Ok(());
        }

        let (client, rx) = Client::new(id.clone(), client_type);
        let client = clients.insert_and_get(id.clone(), client);

        info!("New client joined. (id: {})", id);

        // This is the WebSocket channels for messages.
        // incoming: where we receive messages
        // outgoing: where the websocket send messages
        let (outgoing, incoming) = socket.split();

        // Have the client handle incoming messages.
        let incoming_handler =
            client.handle_incoming_messages(&self, incoming.map_err(|e| e.into()));
        // Forward our sent messages (from tx) to the outgoing sink.
        // This is because the client acts upon channels and doesn't know what the websocket is.
        let receive_from_others =
            Self::forward_messages(&id, rx, outgoing.sink_map_err(|e| e.into()));

        // Setup complete, send the Hello payload.
        client.send(Payload::Hello)?;

        // Irrelevant implementation detail: pinning prevents pointer invalidation
        pin_mut!(incoming_handler, receive_from_others);
        // Select waits for the first task to complete: in this case, its whether
        // the stream `receive_from_others` end or `broadcast_incoming` end first,
        // which indicates that the client connection is dead.
        future::select(incoming_handler, receive_from_others).await;

        // Connection has been destroyed by this stage.
        info!("Client disconnected. (id: {})", &id);
        self.clients.get(&client_type).unwrap().remove(&id);

        Ok(())
    }

    /// Forward messages from a client's receiver to the websocket outgoing stream.
    async fn forward_messages(
        id: &str,
        mut rx: Receiver<Message>,
        mut outgoing: impl Sink<Message, Error = anyhow::Error> + Unpin,
    ) -> Result<()> {
        // outgoing.send_all(&mut rx.map(Ok)) // or forwarding
        while let Some(message) = rx.next().await {
            if let Ok(string) = message.to_str() {
                debug!("Sending text (id: {}): {}", &id, string);
            }
            outgoing.send(message).await?;
        }
        Ok(())
    }
}
