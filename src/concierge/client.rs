use crate::concierge::{Concierge, Service, WsError};
use concierge_api_rs::info;
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

    #[allow(dead_code)]
    /// Returns the uuid of the client.
    pub fn uuid(&self) -> Uuid {
        self.uuid
    }

    /// Returns the name of the client.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// Utility method to construct an origin receipt on certain payloads.
    pub fn info(&self) -> info::Client<'_> {
        let tags = self
            .tags
            .iter()
            .map(String::as_str)
            .map(Cow::Borrowed)
            .collect();

        info::Client {
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

    /// Create a controller that allows for controls between the client
    /// and the concierge.
    pub fn hook<'a, 'b: 'a>(&'a self, concierge: &'b Concierge) -> ClientController<'_, '_> {
        ClientController {
            client: self,
            concierge,
        }
    }
}

/// This to isolate pure client behavior from client-server coupled behavior.
///
/// ### Note on Lifetimes
/// 'c the server must live longer than the client 'a,
/// which seems reasonable.
pub struct ClientController<'a, 'c: 'a> {
    client: &'a Client,
    concierge: &'c Concierge,
}

impl ClientController<'_, '_> {
    /// Attempt to subscribe to a group.
    ///
    /// ### Return Result
    /// If this function returns `None`, it means that no such group exists.
    ///
    /// If this function returns `Some`, then it is attached with the group information.
    /// In addition, there is a boolean indicating if the client subscribed to a new group
    /// (`true`) or is already subscribed to the group (`false`).
    pub async fn subscribe(&self, group_name: &str) -> Option<(info::Service<'static>, bool)> {
        let mut services = self.concierge.services.write().await;
        if let Some(group) = services.get_mut(group_name) {
            let result = group.add_subscriber(self.client.uuid);
            self.client
                .subscriptions
                .write()
                .await
                .insert(group.name.to_owned());
            Some((group.info().owned(), result))
        } else {
            None
        }
    }

    /// Attempt to unsubscribe from a group.
    ///
    /// ### Return Result
    /// If this function returns `None`, it means that no such group exists.
    ///
    /// If this function returns `Some`, then it is attached with the group information.
    /// In addition, there is a boolean indicating if the client unsubscribed from a group
    /// (`true`) or was not subscribed to the group in the first place (`false`).
    pub async fn unsubscribe(&self, group_name: &str) -> Option<(info::Service<'static>, bool)> {
        let mut services = self.concierge.services.write().await;
        if let Some(group) = services.get_mut(group_name) {
            let result = group.remove_subscriber(self.client.uuid);
            self.client.subscriptions.write().await.remove(group_name);
            Some((group.info().owned(), result))
        } else {
            None
        }
    }

    #[allow(dead_code)]
    /// Get all the the client's current subscription list as informational structs.
    pub async fn subscription_info(&self) -> Vec<info::Service<'static>> {
        let subscriptions = self.client.subscriptions.read().await;
        let services = self.concierge.services.read().await;
        subscriptions
            .iter()
            .filter_map(|id| services.get(id))
            .map(Service::info)
            .map(|service_info| service_info.owned())
            .collect::<Vec<_>>()
    }

    /// Create a group if it currently does not exist in the concierge.
    /// Returns `true` if the group was created.
    pub async fn try_create_service(
        &self,
        name: &str,
        nickname: Option<&str>,
    ) -> (info::Service<'static>, bool) {
        let mut services = self.concierge.services.write().await;
        if let Some(service) = services.get(name) {
            (service.info().owned(), false)
        } else {
            let service = services.entry(name.to_string()).or_insert(Service::new(
                name.to_owned(),
                nickname.map(str::to_string),
                self.client.uuid,
            ));
            (service.info().owned(), true)
        }
    }

    /// Remove a group if a client is the owner of that group.
    /// Returns `true` if the group was removed.
    pub async fn try_remove_service(&self, group_name: &str) -> Option<Result<Service, info::Service<'static>>> {
        let mut groups = self.concierge.services.write().await;

        if let Some(service) = groups.get(group_name) {
            if service.owner_uuid == self.client.uuid {
                // Unwrap safety: we just confirmed that the group exist by that key.
                return Some(Ok(groups.remove(group_name).unwrap()))
            } else {
                return Some(Err(service.info().owned()))
            }
        }

        None
    }
}
