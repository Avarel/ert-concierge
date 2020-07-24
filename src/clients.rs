use crate::concierge::{Concierge, WsError};
use concierge_api_rs::payload::ClientPayload;
use serde::Serialize;
use std::{borrow::Cow, collections::HashSet};
use tokio::sync::{
    mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender},
    RwLock,
};
use uuid::Uuid;
use warp::ws::Message;

pub struct Client {
    /// Client id.
    uuid: Uuid,
    /// Client name.
    name: String,
    /// Client nickname.
    nickname: Option<String>,
    /// Client tags.
    tags: Vec<String>,
    /// Sender channel.
    tx: UnboundedSender<Message>,
    /// Groups.
    pub subscriptions: RwLock<HashSet<String>>,
}

impl Client {
    /// Create a new client.
    pub fn new(uuid: Uuid, name: String, nickname: Option<String>, tags: Vec<String>) -> (Self, UnboundedReceiver<Message>) {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded_channel();
        let instance = Self {
            uuid,
            name,
            nickname,
            tags,
            tx,
            subscriptions: RwLock::default(),
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
        let tags = self.tags.iter().map(|t| t.as_str()).collect();

        ClientPayload {
            uuid: self.uuid,
            name: Cow::Borrowed(&self.name),
            nickname: self.nickname.as_deref().map(Cow::Borrowed),
            tags,
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

    pub async fn subscribe(&self, concierge: &Concierge, group_name: &str) -> bool {
        let mut groups = concierge.groups.write().await;
        if let Some(group) = groups.get_mut(group_name) {
            group.add_client(concierge, self.uuid);
            self.subscriptions.write().await.insert(group.name.to_owned());
            true
        } else {
            false
        }
    }

    pub async fn unsubscribe(&self, concierge: &Concierge, group_name: &str) -> bool {
        let mut groups = concierge.groups.write().await;
        if let Some(group) = groups.get_mut(group_name) {
            group.remove_client(concierge, &self.uuid);
            self.subscriptions.write().await.remove(group_name);
            true
        } else {
            false
        }
    }
}
