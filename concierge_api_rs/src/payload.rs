use crate::status::StatusPayload;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use uuid::Uuid;

/// A client payload.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ClientPayload<'a> {
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

impl ClientPayload<'_> {
    pub fn owned(&self) -> ClientPayload<'static> {
        ClientPayload {
            name: Cow::Owned(self.name.to_string()),
            nickname: self.nickname.as_deref().map(str::to_string).map(Cow::Owned),
            uuid: self.uuid,
            tags: self.tags.iter().map(|s| s.to_string()).map(Cow::Owned).collect()
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GroupPayload<'a> {
    /// Group name.
    #[serde(borrow)]
    pub name: Cow<'a, str>,
    /// Group name.
    #[serde(borrow)]
    pub nickname: Option<Cow<'a, str>>,
    /// Uuid of the group's owner.
    pub owner_uuid: Uuid,
    /// Subscribers
    pub subscribers: Vec<Uuid>,
}

impl GroupPayload<'_> {
    pub fn owned(&self) -> GroupPayload<'static> {
        GroupPayload {
            name: Cow::Owned(self.name.to_string()),
            nickname: self.nickname.as_deref().map(str::to_string).map(Cow::Owned),
            owner_uuid: self.owner_uuid,
            subscribers: self.subscribers.clone()
        }
    }
}

impl<'a> ClientPayload<'a> {
    /// Convert the client payload into an origin payload.
    pub fn to_origin(self) -> Origin<'a> {
        Origin {
            client: self,
            group: None,
        }
    }
}

/// An origin receipt for certain payloads.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Origin<'a> {
    #[serde(flatten)]
    pub client: ClientPayload<'a>,
    /// Only available on MESSAGE payloads.
    /// This indicates the group that the message
    /// was originally sent to.
    #[serde(borrow)]
    pub group: Option<GroupPayload<'a>>,
}

impl<'a> Origin<'a> {
    /// Attaches a group to the origin.
    pub fn with_group(mut self, group_payload: GroupPayload<'a>) -> Origin<'a> {
        self.group = Some(group_payload);
        self
    }
}

/// Targetting directive for message payloads.
#[derive(Serialize, Deserialize, Copy, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Target<'a> {
    /// Target a client name.
    Name { name: &'a str },
    /// Target a client Uuid.
    Uuid { uuid: Uuid },
    /// Target a group name.
    Group { group: GroupId<'a> },
    /// Target every client connected to the concierge.
    All,
}

pub type GroupId<'a> = &'a str;

/// HACK(Avarel): Serde deserialize bugs up when it sees a RawValue in a tagged
/// enum, so we have to reconstruct this and try to deserialize this version
/// first.
///
/// A MESSAGE payload that uses RawValue instead, so that the serialization
/// and deserialization process does not attempt to do anything with
/// the data (saving CPU cycles).
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PayloadRawMessage<'a> {
    /// Mimics the "type" tag of Payload. This should always be "MESSAGE".
    pub r#type: &'a str,
    /// Origin of the message.
    #[serde(skip_deserializing)]
    pub origin: Option<Origin<'a>>,
    /// Target of the message. This can be a single user
    /// (using name or uuid), or a group.
    pub target: Target<'a>,
    /// Data field. This is a raw JSON value field that borrows the JSON
    /// string directly from the deserialized buffer.
    #[serde(borrow)]
    pub data: &'a serde_json::value::RawValue,
}

impl<'a> PayloadRawMessage<'a> {
    pub fn new(target: Target<'a>, data: &'a serde_json::value::RawValue) -> Self {
        PayloadRawMessage {
            r#type: "MESSAGE",
            origin: None,
            target,
            data,
        }
    }

    pub fn with_origin(mut self, origin: Origin<'a>) -> Self {
        self.origin = Some(origin);
        self
    }
}

/// Packets sent from the client to the Gateway API are encapsulated within a
/// gateway payload object and must have the proper operation and data object set.
///
/// # Example
/// ```json
/// { "type": "ABCDEFG", "data": { "foo": "bar" }}
/// ```
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Payload<'a, T> {
    /// This payload must be the first payload sent
    /// within 5 seconds of establishing the socket connection, else the
    /// connection will be dropped.
    Identify {
        name: &'a str,
        nickname: Option<&'a str>,
        version: &'a str,
        secret: Option<&'a str>,
        #[serde(default)]
        tags: Vec<&'a str>,
    },
    /// These payloads have special fields for targeting
    /// other users or plugins. The origin fields are ignored if they are
    /// sent to the concierge, since the identification process happens
    /// per socket. The data field is transmitted verbatim.
    ///
    /// When relaying payloads, prefer to use PayloadMessageRaw instead.
    Message {
        /// Origin of the message.
        #[serde(borrow)]
        origin: Option<Origin<'a>>,
        /// Target of the message. This can be a single user
        /// (using name or uuid), or a group.
        target: Target<'a>,
        /// Data field.
        data: T,
    },
    /// Subscribe to a group's broadcast.
    SelfSubscribe { name: GroupId<'a> },
    /// Unsubscribe from a group's broadcast.
    SelfUnsubscribe { name: GroupId<'a> },
    /// This payload asks for the connecting client's
    /// subscriptions.
    SelfFetch,
    /// Create a group such that every subscriber
    /// will receive the message targeted towards that group.
    GroupCreate {
        name: GroupId<'a>,
        nickname: Option<&'a str>,
    },
    /// Delete a group. This operation only succeeds if
    /// the client is the group's owner.
    GroupDelete { name: GroupId<'a> },
    /// Fetch general group information.
    GroupFetch { name: GroupId<'a> },
    /// This payload asks for all of the groups
    /// registered with the concierge.
    GroupFetchAll,
    /// This payload asks for all of the clients
    /// connected to the concierge.
    ClientFetchAll,
    /// This payload is sent upon successful identification.
    /// The payload will also contain a universally unique identifier
    /// that acts as a file server key. The payload also returns
    /// the server's version.
    Hello { uuid: Uuid, version: &'a str },
    /// General group information.
    GroupFetchResult {
        #[serde(flatten)]
        group: GroupPayload<'a>,
    },
    /// This payload lists all of the groups registered with the concierge.
    GroupFetchAllResult {
        #[serde(borrow)]
        groups: Vec<GroupPayload<'a>>,
    },
    /// This payload lists all of the clients registered with the concierge.
    ClientFetchAllResult {
        #[serde(borrow)]
        clients: Vec<ClientPayload<'a>>,
    },
    /// This payload lists all of the connecting client's subscriptions.
    SelfFetchResult {
        #[serde(flatten)]
        client: ClientPayload<'a>,
        subscriptions: Vec<GroupPayload<'a>>,
    },
    /// Status payload sent by the concierge. May happen for various reasons
    /// such as error response.
    Status {
        /// Data of the status.
        #[serde(flatten)]
        data: StatusPayload<'a>,
    },
}

impl<'a, T> Payload<'a, T> {
    pub fn seq(self, seq: usize) -> SequencedPayload<'a, T> {
        return SequencedPayload {
            seq,
            payload: self
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SequencedPayload<'a, T> {
    /// Sequence number. This may not always be applicable since status
    /// events are sometimes fired automatically and not in response to
    /// an input from the socket.
    seq: usize,
    /// The actual payload object.
    #[serde(flatten, borrow="'a")]
    payload: Payload<'a, T>
}
