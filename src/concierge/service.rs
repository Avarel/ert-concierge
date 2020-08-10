use super::Concierge;
use concierge_api_rs::info;
use serde::Serialize;
use std::{borrow::Cow, collections::HashSet};
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

    /// Create a controller that allows for controls between the service
    /// and the concierge.
    pub fn hook<'a, 'b: 'a>(&'a self, concierge: &'b Concierge) -> ServiceController<'_, '_> {
        ServiceController {
            service: self,
            concierge,
        }
    }
}

/// This to isolate pure client behavior from service-server coupled behavior.
pub struct ServiceController<'a, 'c: 'a> {
    service: &'a Service,
    concierge: &'c Concierge,
}

impl ServiceController<'_, '_> {
    /// Broadcast a payload to all connected client of a certain group.
    pub fn broadcast(&self, payload: &impl Serialize, to_owner: bool) {
        let message = serde_json::to_string(&payload).expect("Serialization");
        let clients = self.concierge.clients.borrow();
        self.service
            .clients
            .iter()
            .filter(|client_uuid| to_owner || **client_uuid != self.service.owner_uuid)
            .filter_map(|client_uuid| clients.get(client_uuid))
            .for_each(|client| {
                client.send_ws_msg(message.clone());
            });
    }
}
