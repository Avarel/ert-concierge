use super::{service::Service, OutgoingMessage};
use actix::prelude::*;
use actix_web_actors::ws::Message as WsMessage;
use concierge_api_rs::info;
use serde::Serialize;
use std::{
    borrow::Cow,
    collections::{HashMap, HashSet},
};
use uuid::Uuid;

/// A struct holding information regarding the client.
pub struct Client {
    /// Client id.
    pub uuid: Uuid,
    /// Client name.
    pub name: String,
    /// Client nickname.
    pub nickname: Option<String>,
    pub seq: usize,
    /// Client tags.
    pub tags: Vec<String>,
    /// Actor address for a recipient that
    /// receives messages from the central server.
    pub addr: Recipient<OutgoingMessage>,
    /// Subscriptions.
    pub subscriptions: HashSet<String>,
}

impl Client {
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

    /// Send a serialized payload.
    pub fn send(&self, payload: &impl Serialize) {
        self.send_string(&serde_json::to_string(payload).expect("Serialization"))
    }

    /// Send a string message.
    pub fn send_string(&self, string: &str) {
        self.send_ws_message(WsMessage::Text(string.to_string()));
    }

    /// Send a WebSocket message.
    pub fn send_ws_message(&self, message: WsMessage) {
        let _ = self.addr.do_send(OutgoingMessage(message));
    }

    /// Attempt to subscribe to a group.
    ///
    /// ### Return Result
    /// If this function returns `None`, it means that no such group exists.
    ///
    /// If this function returns `Some`, then it is attached with the group information.
    /// In addition, there is a boolean indicating if the client subscribed to a new group
    /// (`true`) or is already subscribed to the group (`false`).
    pub fn subscribe(
        &mut self,
        services: &mut HashMap<String, Service>,
        service_name: &str,
    ) -> Option<(info::Service<'static>, bool)> {
        if let Some(group) = services.get_mut(service_name) {
            let result = group.add_subscriber(self.uuid);
            self.subscriptions.insert(group.name.to_owned());
            Some((group.info().owned(), result))
        } else {
            None
        }
    }

    /// Attempt to unsubscribe from a group.
    ///
    /// ### Notes
    /// You must not be borrowing Concierge#services.
    ///
    /// ### Return Result
    /// If this function returns `None`, it means that no such group exists.
    ///
    /// If this function returns `Some`, then it is attached with the group information.
    /// In addition, there is a boolean indicating if the client unsubscribed from a group
    /// (`true`) or was not subscribed to the group in the first place (`false`).
    pub fn unsubscribe(
        &mut self,
        services: &mut HashMap<String, Service>,
        service_name: &str,
    ) -> Option<(info::Service<'static>, bool)> {
        if let Some(group) = services.get_mut(service_name) {
            let result = group.remove_subscriber(self.uuid);
            self.subscriptions.remove(service_name);
            Some((group.info().owned(), result))
        } else {
            None
        }
    }

    /// Create a group if it currently does not exist in the concierge.
    ///
    /// # Return Result
    /// * `(_, true)` if the group was created.
    /// * `(_, false)` if the group was already created.
    pub fn try_create_service(
        &self,
        services: &mut HashMap<String, Service>,
        name: &str,
        nickname: Option<&str>,
    ) -> (info::Service<'static>, bool) {
        if let Some(service) = services.get(name) {
            (service.info().owned(), false)
        } else {
            let service = services.entry(name.to_string()).or_insert_with(|| {
                Service::new(name.to_owned(), nickname.map(str::to_string), self.uuid)
            });
            (service.info().owned(), true)
        }
    }

    /// Remove a group if a client is the owner of that group.
    ///
    /// # Return Result
    /// * `Some(Ok(_))` if the group was removed.
    /// * `Some(Err(_))` if the group was not removed since this is not the owner's client.
    /// * `None` if the group does not exist.
    pub fn try_remove_service(
        &self,
        services: &mut HashMap<String, Service>,
        service_name: &str,
    ) -> Option<Result<Service, info::Service<'static>>> {
        if let Some(service) = services.get(service_name) {
            if service.owner_uuid == self.uuid {
                // Unwrap safety: we just confirmed that the group exist by that key.
                return Some(Ok(services.remove(service_name).unwrap()));
            } else {
                return Some(Err(service.info().owned()));
            }
        }

        None
    }
}