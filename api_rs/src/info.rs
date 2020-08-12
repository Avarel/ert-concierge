use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::borrow::Cow;

/// A client payload.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Client<'a> {
    /// Client name.
    #[serde(borrow)]
    pub name: Cow<'a, str>,
    /// Client name.
    #[serde(borrow)]
    pub nickname: Option<Cow<'a, str>>,
    /// Uuid of the client.
    pub uuid: Uuid,
    /// Tags of the client.
    pub tags: Vec<Cow<'a, str>>,
}

impl<'a> Client<'a> {
    /// Convert the client payload into an origin payload.
    pub fn to_origin(self) -> Origin<'a> {
        Origin {
            client: self,
            service: None,
        }
    }

    /// Uncouple the information from the original borrowed lifetime
    /// and return a struct that has fully owned references.
    pub fn owned(&self) -> Client<'static> {
        Client {
            name: Cow::Owned(self.name.to_string()),
            nickname: self.nickname.as_deref().map(str::to_string).map(Cow::Owned),
            uuid: self.uuid,
            tags: self
                .tags
                .iter()
                .map(|s| s.to_string())
                .map(Cow::Owned)
                .collect(),
        }
    }
}

/// A service payload.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Service<'a> {
    /// Service name.
    #[serde(borrow)]
    pub name: Cow<'a, str>,
    /// Service name.
    #[serde(borrow)]
    pub nickname: Option<Cow<'a, str>>,
    /// Uuid of the service's owner.
    pub owner_uuid: Uuid,
    /// Subscribers
    pub subscribers: Vec<Uuid>,
}

impl Service<'_> {
    /// Uncouple the information from the original borrowed lifetime
    /// and return a struct that has fully owned references.
    pub fn owned(&self) -> Service<'static> {
        Service {
            name: Cow::Owned(self.name.to_string()),
            nickname: self.nickname.as_deref().map(str::to_string).map(Cow::Owned),
            owner_uuid: self.owner_uuid,
            subscribers: self.subscribers.clone(),
        }
    }
}

/// An origin receipt for certain payloads.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Origin<'a> {
    #[serde(flatten)]
    pub client: Client<'a>,
    /// Only available on MESSAGE payloads.
    /// This indicates the service that the message
    /// was originally sent to.
    #[serde(borrow)]
    pub service: Option<Service<'a>>,
}

impl<'a> Origin<'a> {
    /// Attaches a service to the origin.
    pub fn with_service(mut self, service_info: Service<'a>) -> Origin<'a> {
        self.service = Some(service_info);
        self
    }
}