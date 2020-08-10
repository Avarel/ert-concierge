use uuid::Uuid;
use std::{borrow::Cow, collections::HashSet};
use concierge_api_rs::info;

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
}