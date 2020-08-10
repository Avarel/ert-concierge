use super::client::Client;
use concierge_api_rs::info;
use serde::Serialize;
use std::{borrow::Cow, collections::{HashMap, HashSet}};
use uuid::Uuid;

pub struct Service {
    pub name: String,
    pub nickname: Option<String>,
    pub owner_uuid: Uuid,
    pub clients: HashSet<Uuid>,
}

impl Service {
    /// Create a new group associated with an owner uuid.
    pub fn new(name: String, nickname: Option<String>, owner_uuid: Uuid) -> Self {
        Self {
            name,
            nickname,
            owner_uuid,
            clients: HashSet::new(),
        }
    }

    /// Utility method to construct an origin receipt on certain payloads.
    pub fn info(&self) -> info::Service<'_> {
        info::Service {
            name: Cow::Borrowed(&self.name),
            nickname: self.nickname.as_deref().map(Cow::Borrowed),
            owner_uuid: self.owner_uuid,
            subscribers: self.clients.iter().copied().collect::<Vec<_>>(),
        }
    }

    /// Add the client to the group.
    pub fn add_subscriber(&mut self, uuid: Uuid) -> bool {
        self.clients.insert(uuid)
    }

    /// Remove the client from the group.
    pub fn remove_subscriber(&mut self, uuid: Uuid) -> bool {
        self.clients.remove(&uuid)
    }

    /// Broadcast a serialized payload between the intersection of the provided
    /// client list and the service's client list.
    pub fn broadcast(&self, clients: &HashMap<Uuid, Client>, payload: &impl Serialize, to_owner: bool) {
        let string = serde_json::to_string(&payload).expect("Serialization");
        self.broadcast_string(clients, &string, to_owner)
    }

    /// Broadcast a string message between the intersection of the provided
    /// client list and the service's client list.
    pub fn broadcast_string(&self, clients: &HashMap<Uuid, Client>, string: &str, to_owner: bool) {
        self.clients
            .iter()
            .filter(|client_uuid| to_owner || **client_uuid != self.owner_uuid)
            .filter_map(|client_uuid| clients.get(client_uuid))
            .for_each(|client| {
                client.send_string(&string);
            });
    }
}
