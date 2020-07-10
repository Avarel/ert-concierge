use crate::concierge::WsError;
use std::{borrow::Cow, collections::HashSet};
use tokio::sync::{mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender}, RwLock};
use uuid::Uuid;
use warp::ws::Message;
use serde::Serialize;
use concierge_api_rs::payload::ClientPayload;

pub struct Client {
    /// Client id.
    uuid: Uuid,
    /// Client name.
    name: String,
    /// Sender channel.
    tx: UnboundedSender<Message>,
    /// Groups.
    pub groups: RwLock<HashSet<String>>,
}

impl Client {
    /// Create a new client.
    pub fn new(uuid: Uuid, name: String) -> (Self, UnboundedReceiver<Message>) {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded_channel();
        let instance = Self {
            uuid,
            name,
            tx,
            groups: RwLock::default(),
        };
        (instance, rx)
    }

    /// Returns the Uuid of the client.
    pub fn uuid(&self) -> Uuid {
        self.uuid
    }

    /// Returns the name of the client.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// Utility method to construct an origin receipt on certain payloads.
    pub fn make_payload(&self) -> ClientPayload<'_> {
        ClientPayload {
            uuid: self.uuid,
            name: Cow::Borrowed(&self.name)
        }
    }

    /// Send a payload.
    pub fn send(&self, payload: impl Serialize) -> Result<(), WsError> {
        self.send_ws_msg(Message::text(serde_json::to_string(&payload)?))
    }

    /// Send a WebSocket message.
    pub fn send_ws_msg(&self, msg: Message) -> Result<(), WsError> {
        self.tx.send(msg).map_err(|_| WsError::Channel)
    }
}
