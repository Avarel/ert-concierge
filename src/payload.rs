use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use uuid::Uuid;

/// Payloads where the message data fields are JSON values.
pub type JsonPayload<'a> = Payload<'a, serde_json::Value>;

/// A client payload.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ClientPayload<'a> {
    /// Client name.
    #[serde(borrow)]
    pub name: Cow<'a, str>,
    /// Uuid of the client.
    pub uuid: Uuid
}

impl<'a> ClientPayload<'a> {
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
    pub group: Option<Cow<'a, str>>,
}

impl<'a> Origin<'a> {
    /// Attaches a group to the origin.
    pub fn with_group(mut self, group: GroupId<'a>) -> Origin<'a> {
        self.group = Some(group.into());
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
        version: &'a str,
        secret: Option<&'a str>,
    },
    /// These payloads have special fields for targeting
    /// other users or plugins. The origin fields are ignored if they are
    /// sent to the concierge, since the identification process happens
    /// per socket. The data field is transmitted verbatim.
    ///
    /// When relaying payloads, prefer to use PayloadMessageRaw instead.
    Message {
        /// Origin of the message.
        #[serde(skip_deserializing)]
        origin: Option<Origin<'a>>,
        /// Target of the message. This can be a single user
        /// (using name or uuid), or a group.
        target: Target<'a>,
        /// Data field.
        data: T,
    },
    /// Subscribe to a group's broadcast.
    Subscribe { group: GroupId<'a> },
    /// Unsubscribe from a group's broadcast.
    Unsubscribe { group: GroupId<'a> },
    /// Create a group such that every subscriber
    /// will receive the message targeted towards that group.
    GroupCreate { group: GroupId<'a> },
    /// Delete a group. This operation only succeeds if
    /// the client is the group's owner.
    GroupDelete { group: GroupId<'a> },
    /// This payload asks for all the clients of the
    /// group specified in the data field.
    FetchGroupSubscribers { group: GroupId<'a> },
    /// This payload asks for all of the groups
    /// registered with the concierge.
    FetchGroups,
    /// This payload asks for all of the clients
    /// connected to the concierge.
    FetchClients,
    /// This payload asks for the connecting client's
    /// subscriptions.
    FetchSubs,
    /// This payload is sent upon successful identification.
    /// The payload will also contain a universally unique identifier
    /// that acts as a file server key. The payload also returns
    /// the server's version.
    Hello { uuid: Uuid, version: &'a str },
    /// Returns all of the clients (subscribed to the group) an array of origin structs.
    GroupSubscribers {
        group: GroupId<'a>,
        #[serde(borrow)]
        clients: Vec<ClientPayload<'a>>,
    },
    /// This payload lists all of the groups registered with the concierge.
    Groups {
        #[serde(borrow)]
        groups: Vec<Cow<'a, str>>,
    },
    /// This payload lists all of the clients registered with the concierge.
    Clients {
        #[serde(borrow)]
        clients: Vec<ClientPayload<'a>>,
    },
    /// This payload lists all of the connecting client's subscriptions.
    Subscriptions {
        #[serde(borrow)]
        groups: Vec<Cow<'a, str>>,
    },
    /// Status payload sent by the concierge. May happen for various reasons
    /// such as error response.
    Status {
        /// Sequence number. This may not always be applicable since status
        /// events are sometimes fired automatically and not in response to
        /// an input from the socket.
        seq: Option<usize>,
        /// Data of the status.
        #[serde(flatten)]
        data: StatusPayload<'a>,
    },
}

/// Status structs.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "code", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum StatusPayload<'a> {
    /// A payload broadcasted whenever a new client joins. This is not
    /// emitted to newly joining clients.
    ClientJoined {
        #[serde(flatten)]
        data: ClientPayload<'a>,
    },
    /// A payload broadcasted whenever a new client leaves. This is not
    /// emitted to leaving clients.
    ClientLeft {
        #[serde(flatten)]
        data: ClientPayload<'a>,
    },
    /// Generic OK.
    Ok,
    /// Indicates that a message has been sent successfully.
    MessageSent,
    /// Indicates that the client is now subscribed to a group.
    Subscribed { group: GroupId<'a> },
    /// Indicates that the client is no longer subscribed to a group.
    /// May not be attached with a sequence number if the client did not send
    /// an UNSUBSCRIBE payload to unsubscribe from this group.
    Unsubscribed { group: GroupId<'a> },
    /// Indicates that a new group has been created.
    /// May not be attached with a sequence number if the client did not send
    /// a CREATE_GROUP payload to create this group.
    GroupCreated { group: GroupId<'a> },
    /// Indicates that a group has been deleted.
    /// May not be attached with a sequence number if the client did not send
    /// a DELETE_GROUP payload to delete this group.
    GroupDeleted { group: GroupId<'a> },
    /// Generic BAD payload.
    Bad,
    /// Indicates that the "type" of the incoming payload is not supported.
    /// An example would be trying to send a well-formed HELLO payload
    /// to the concierge.
    Unsupported,
    /// Indicates that the concierge has failed to decode the payload
    /// due to some reason (reported by serde).
    Protocol { desc: &'a str },
    /// Indicates that the group has already been created.
    /// This is sent in response to GROUP_CREATE payload.
    GroupAlreadyCreated { group: GroupId<'a> },
    /// Indicates that no such name exists in the namespace of the conciergee.
    NoSuchName { name: &'a str },
    /// Indicates that the Uuid is unrecognized by the concierge.
    NoSuchUuid { uuid: Uuid },
    /// Indicates that the group name is not registered with the concierge.
    NoSuchGroup { group: GroupId<'a> },
}

/// Utility methods to create good statuses.
pub mod ok {
    use super::JsonPayload;
    use super::StatusPayload;

    #[allow(dead_code)]
    pub const fn ok(seq: usize) -> JsonPayload<'static> {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::Ok,
        }
    }

    pub fn message_sent(seq: usize) -> JsonPayload<'static> {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::MessageSent,
        }
    }

    pub fn subscribed(seq: usize, group: &str) -> JsonPayload {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::Subscribed { group },
        }
    }

    pub fn unsubscribed(seq: Option<usize>, group: &str) -> JsonPayload {
        JsonPayload::Status {
            seq,
            data: StatusPayload::Unsubscribed { group },
        }
    }

    pub fn created_group(seq: Option<usize>, group: &str) -> JsonPayload {
        JsonPayload::Status {
            seq,
            data: StatusPayload::GroupCreated { group },
        }
    }

    pub fn deleted_group(seq: Option<usize>, group: &str) -> JsonPayload {
        JsonPayload::Status {
            seq,
            data: StatusPayload::GroupDeleted { group },
        }
    }
}

/// Utility methods to create bad statuses.
pub mod err {
    use super::JsonPayload;
    use super::StatusPayload;
    use uuid::Uuid;

    #[allow(dead_code)]
    pub const fn bad(seq: usize) -> JsonPayload<'static> {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::Bad,
        }
    }

    pub fn unsupported(seq: usize) -> JsonPayload<'static> {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::Unsupported,
        }
    }

    pub fn protocol(seq: usize, desc: &str) -> JsonPayload {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::Protocol { desc },
        }
    }

    pub fn group_already_created(seq: usize, group: &str) -> JsonPayload {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::GroupAlreadyCreated { group },
        }
    }

    pub fn no_such_name(seq: usize, name: &str) -> JsonPayload {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::NoSuchName { name },
        }
    }

    pub fn no_such_uuid(seq: usize, uuid: Uuid) -> JsonPayload<'static> {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::NoSuchUuid { uuid },
        }
    }

    pub fn no_such_group(seq: usize, group: &str) -> JsonPayload {
        JsonPayload::Status {
            seq: Some(seq),
            data: StatusPayload::NoSuchGroup { group },
        }
    }
}

pub mod close_codes {
    #[allow(dead_code)]
    pub const UNKNOWN: u16 = 4000;
    pub const FATAL_DECODE: u16 = 4002;
    pub const NO_AUTH: u16 = 4003;
    pub const AUTH_FAILED: u16 = 4004;
    pub const DUPLICATE_AUTH: u16 = 4005;
    pub const BAD_SECRET: u16 = 4006;
    pub const BAD_VERSION: u16 = 4007;
}
