use crate::{
    clients::Client,
    payload::{close_codes, Payload},
    util::FileReply,
};
use anyhow::{anyhow, Result};
use dashmap::DashMap;
use futures::{future, pin_mut, stream::TryStreamExt, SinkExt, StreamExt};
use log::{debug, info, warn};
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tokio::{fs::File, time::timeout};
use uuid::Uuid;
use warp::ws::{Message, WebSocket};

pub struct Concierge {
    pub groups: DashMap<String, DashMap<Uuid, ()>>,
    pub namespace: DashMap<String, Uuid>,
    pub clients: DashMap<Uuid, Client>,
}

impl Concierge {
    /// Creates a new concierge.
    pub fn new() -> Self {
        Self {
            groups: DashMap::new(),
            clients: DashMap::new(),
            namespace: DashMap::new(),
        }
    }
}

impl Concierge {
    /// Broadcast a payload to all connected client of a certain group.
    pub fn broadcast(&self, group: &str, payload: Payload) -> Result<bool> {
        if let Some(group_list) = self.groups.get(group) {
            let message = Message::text(serde_json::to_string(&payload)?);
            for entry in group_list.iter() {
                if let Some(client) = self.clients.get(entry.key()) {
                    client.send_ws_msg(message.clone())?;
                } else {
                    warn!("Group had an invalid client id");
                }
            }
            Ok(true)
        } else {
            Ok(false)
        }
    }

    /// Broadcast to all connected clients.
    pub fn broadcast_all(&self, payload: Payload) -> Result<()> {
        let message = Message::text(serde_json::to_string(&payload)?);
        for client in self.clients.iter() {
            client.send_ws_msg(message.clone())?;
        }
        Ok(())
    }

    /// Handle incoming TCP connections and upgrade them to a Websocket connection.
    pub async fn handle_socket_conn(
        self: Arc<Self>,
        mut socket: WebSocket,
        addr: Option<SocketAddr>,
    ) -> Result<()> {
        if let Some(addr) = addr {
            // Protocol: Expect a payload that identifies the client within 5 seconds.
            match Self::handle_identification(&mut socket).await {
                // Got the identification data successfully.
                Ok(id) => {
                    debug!("Identification successful. (ip: {}, id: {})", addr, id);
                    Ok(self.handle_client(id, socket).await?)
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

    /// Handle new client WebSocket connections.
    async fn handle_client(self: Arc<Self>, name: String, mut socket: WebSocket) -> Result<()> {
        // Duplicate identification, close the stream.
        if self.namespace.contains_key(&name) {
            warn!("User attempted to join with existing id. (name: {})", name);
            socket
                .send(Message::close_with(
                    close_codes::DUPLICATE_AUTH,
                    "Identification failed",
                ))
                .await?;
            socket.close().await?;
            return Ok(());
        }

        // Handle new client
        let uuid = Uuid::new_v4();
        info!("New client joined. (name: {}, uuid: {})", name, uuid);
        let (client, rx) = Client::new(uuid, name.clone());
        self.broadcast_all(Payload::ClientJoin {
            data: client.origin_receipt(),
        })?;
        let client = self.clients.insert_and_get(uuid, client);
        // Add to namespace
        self.namespace.insert(name.clone(), uuid);

        // This is the WebSocket channels for messages.
        // incoming: where we receive messages
        // outgoing: where the websocket send messages
        let (outgoing, incoming) = socket.split();

        // Have the client handle incoming messages.
        let incoming_handler =
            client.handle_incoming_messages(&self, incoming.map_err(|e| e.into()));
        // Forward our sent messages (from tx) to the outgoing sink.
        // This is because the client acts upon channels and doesn't know what the websocket is.
        let receive_from_others = rx
            .inspect(|m| {
                if let Ok(string) = m.to_str() {
                    debug!("Sending text (id: {}): {}", &name, string);
                }
            })
            .map(Ok)
            .forward(outgoing);

        // Setup complete, send the Hello payload.
        client.send(Payload::Hello { uuid })?;

        // Irrelevant implementation detail: pinning prevents pointer invalidation
        pin_mut!(incoming_handler, receive_from_others);
        // Select waits for the first task to complete: in this case, its whether
        // the stream `receive_from_others` end or `broadcast_incoming` end first,
        // which indicates that the client connection is dead.
        future::select(incoming_handler, receive_from_others).await;

        // Connection has been destroyed by this stage.
        info!("Client disconnected. (id: {})", &name);
        // Remove client from table, unwrap safety: the client must exist
        // because this is the only place where we remove it!
        let client = self.clients.remove_take(&uuid).unwrap();
        // Remove from namespace
        self.namespace.remove(&name);
        // Remove from groups
        self.groups.iter().for_each(|e| {
            e.remove(&uuid);
        });

        // Broadcast leave
        self.broadcast_all(Payload::ClientLeave {
            data: client.origin_receipt(),
        })?;

        Ok(())
    }

    pub async fn handle_file_request(self: Arc<Self>, string: String) -> Result<FileReply> {
        Ok(FileReply::new(
            "file.txt",
            File::open(format!("./{}", string)).await?,
        ))
    }
}
