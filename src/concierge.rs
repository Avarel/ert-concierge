use crate::{
    clients::{Client, ClientGroup},
    payload::{close_codes, ClientData, Payload},
};
use anyhow::{anyhow, Result};
use dashmap::DashMap;
use flume::Receiver;
use futures::{future, pin_mut, stream::TryStreamExt, Sink, SinkExt, StreamExt};
use hyper::Body;
use log::{debug, info, warn};
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tokio::{fs::File, time::timeout};
use tokio_util::codec::{BytesCodec, FramedRead};
use uuid::Uuid;
use warp::{
    http::Response,
    ws::{Message, WebSocket},
};

pub struct Concierge {
    pub groups: DashMap<ClientGroup, DashMap<String, Uuid>>,
    pub clients: DashMap<Uuid, Client>,
}

impl Concierge {
    /// Creates a new concierge.
    pub fn new() -> Self {
        let namespaces = DashMap::new();
        namespaces.insert(ClientGroup::PLUGIN, DashMap::new());
        namespaces.insert(ClientGroup::USER, DashMap::new());
        let clients = DashMap::new();
        Self {
            groups: namespaces,
            clients: clients,
        }
    }
}

impl Concierge {
    /// Broadcast a payload to all connected client of a certain group.
    pub fn broadcast(&self, group: ClientGroup, payload: Payload) -> Result<()> {
        let message = Message::text(serde_json::to_string(&payload)?);
        for uuid in self.groups.get(&group).unwrap().iter() {
            self.clients
                .get(uuid.value())
                .unwrap()
                .send_ws_msg(message.clone())?;
        }
        Ok(())
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
                Ok((id, client_type)) => {
                    debug!("Identification successful. (ip: {}, id: {})", addr, id);
                    Ok(self.handle_client(client_type, id, socket).await?)
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
    async fn handle_identification(socket: &mut WebSocket) -> Result<(String, ClientGroup), u16> {
        // Protocol: Expect a payload that identifies the client within 5 seconds.
        if let Ok(Some(Ok(msg))) = timeout(Duration::from_secs(5), socket.next()).await {
            debug!("{:?}", msg);
            if let Ok(payload) = msg
                .to_str()
                .and_then(|s| serde_json::from_str::<Payload>(s).map_err(|_| ()))
            {
                if let Payload::Identify { data } = payload {
                    return Ok((data.name.to_owned(), data.group));
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
        client_type: ClientGroup,
        name: String,
        mut socket: WebSocket,
    ) -> Result<()> {
        let group = self.groups.get(&client_type).unwrap();
        // Duplicate identification, close the stream.
        if group.contains_key(&name) {
            warn!("User attempted to join with existing id. (id: {})", name);
            socket
                .send(Message::close_with(
                    close_codes::DUPLICATE_AUTH,
                    "Identification failed",
                ))
                .await?;
            socket.close().await?;
            return Ok(());
        }

        info!("New client joined. (id: {})", name);
        self.broadcast_all(Payload::ClientJoin {
            data: ClientData {
                name: &name,
                group: client_type,
            },
        })?;

        let uuid = Uuid::new_v4();
        group.insert(name.clone(), uuid);
        let (client, rx) = Client::new(uuid, name.clone(), client_type);
        let client = self.clients.insert_and_get(uuid, client);

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
            Self::forward_messages(&name, rx, outgoing.sink_map_err(|e| e.into()));

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
        self.groups.get(&client_type).unwrap().remove(&name);
        self.clients.remove(&uuid);
        self.broadcast_all(Payload::ClientLeave {
            data: ClientData {
                name: &name,
                group: client_type,
            },
        })?;

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

    pub async fn handle_file_request(self: Arc<Self>, string: String) -> Result<FileReply> {
        Ok(FileReply::new(
            "file.txt",
            File::open(format!("./{}", string)).await?,
        ))
    }
}

pub struct FileReply(String, File);

impl FileReply {
    pub fn new(string: impl ToString, file: File) -> Self {
        Self(string.to_string(), file)
    }
}

impl warp::Reply for FileReply {
    fn into_response(self) -> warp::reply::Response {
        let stream = FramedRead::new(self.1, BytesCodec::new());
        let res = Response::builder()
            .header(
                "Content-Disposition",
                format!("attachment; filename=\"{}\"", self.0),
            )
            .body(Body::wrap_stream(stream))
            .unwrap();
        res
    }
}
