use crate::concierge::{Concierge, WsError};
use concierge_api_rs::payload::{ClientPayload, GroupPayload};
use serde::Serialize;
use std::{borrow::Cow, collections::HashSet};
use tokio::sync::{
    mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender},
    RwLock,
};
use uuid::Uuid;
use warp::ws::Message;

/// A struct holding information regarding the client.
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
    rx: Option<UnboundedReceiver<Message>>,
    /// Groups.
    pub subscriptions: RwLock<HashSet<String>>,
}

impl Client {
    /// Create a new client.
    ///
    /// This returns the client struct and the single-consumer receiver side of
    /// the sender-receiver channel.
    pub fn new(uuid: Uuid, name: String, nickname: Option<String>, tags: Vec<String>) -> Self {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded_channel();
        Self {
            uuid,
            name,
            nickname,
            tags,
            tx,
            rx: Some(rx),
            subscriptions: RwLock::default(),
        }
    }

    /// Take the receiver channel.
    pub fn take_rx(&mut self) -> Option<UnboundedReceiver<Message>> {
        self.rx.take()
    }

    /// Returns the uuid of the client.
    pub fn uuid(&self) -> Uuid {
        self.uuid
    }

    /// Returns the name of the client.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// Utility method to construct an origin receipt on certain payloads.
    pub fn make_payload(&self) -> ClientPayload<'_> {
        let tags = self
            .tags
            .iter()
            .map(String::as_str)
            .map(Cow::Borrowed)
            .collect();

        ClientPayload {
            uuid: self.uuid,
            name: Cow::Borrowed(&self.name),
            nickname: self.nickname.as_deref().map(Cow::Borrowed),
            tags,
        }
    }

    /// Send a payload.
    pub fn send(&self, payload: &impl Serialize) -> Result<(), WsError> {
        self.send_ws_msg(Message::text(serde_json::to_string(payload)?))
    }

    /// Send a WebSocket message.
    pub fn send_ws_msg(&self, msg: Message) -> Result<(), WsError> {
        self.tx.send(msg).map_err(|_| WsError::Channel)
    }

    /// Attempt to subscribe to a group.
    pub async fn subscribe(
        &self,
        concierge: &Concierge,
        group_name: &str,
    ) -> Option<GroupPayload<'_>> {
        let mut groups = concierge.groups.write().await;
        if let Some(group) = groups.get_mut(group_name) {
            group.add_subscriber(concierge, self.uuid);
            self.subscriptions
                .write()
                .await
                .insert(group.name.to_owned());
            Some(group.make_payload().owned())
        } else {
            None
        }
    }

    /// Attempt to unsubscribe from a group.
    pub async fn unsubscribe(&self, concierge: &Concierge, group_name: &str) -> Option<GroupPayload<'_>> {
        let mut groups = concierge.groups.write().await;
        if let Some(group) = groups.get_mut(group_name) {
            group.remove_subscriber(concierge, &self.uuid);
            self.subscriptions.write().await.remove(group_name);
            Some(group.make_payload().owned())
        } else {
            None
        }
    }
}
