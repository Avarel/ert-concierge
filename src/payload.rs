use serde::{Deserialize, Serialize};
use serde_json::{value::RawValue, Value};
use uuid::Uuid;

pub mod ok {
    use super::Payload;
    use super::StatusPayload;

    #[allow(dead_code)]
    pub const fn ok(seq: usize) -> Payload<'static> {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::Ok
        }
    }

    pub fn message_sent(seq: usize) -> Payload<'static> {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::MessageSent,
        }
    }

    pub fn subscribed(seq: usize, group: &str) -> Payload {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::Subscribed { group }
        }
    }

    pub fn unsubscribed(seq: Option<usize>, group: &str) -> Payload {
        Payload::Status {
            seq,
            data: StatusPayload::Unsubscribed { group }
        }
    }

    pub fn created_group(seq: Option<usize>, group: &str) -> Payload {
        Payload::Status {
            seq,
            data: StatusPayload::GroupCreated { group }
        }
    }

    pub fn deleted_group(seq: Option<usize>, group: &str) -> Payload {
        Payload::Status {
            seq,
            data: StatusPayload::GroupDeleted { group }
        }
    }
}

pub mod err {
    use super::Payload;
    use super::StatusPayload;
    use uuid::Uuid;

    #[allow(dead_code)]
    pub const fn bad(seq: usize) -> Payload<'static> {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::Bad
        }
    }

    pub fn unsupported(seq: usize) -> Payload<'static> {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::Unsupported
        }
    }

    pub fn protocol(seq: usize, desc: &str) -> Payload {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::Protocol { desc }
        }
    }

    pub fn group_already_created(seq: usize, group: &str) -> Payload {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::GroupAlreadyCreated { group }
        }
    }

    pub fn no_such_name(seq: usize, name: &str) -> Payload {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::NoSuchName { name }
        }
    }

    pub fn no_such_uuid(seq: usize, uuid: Uuid) -> Payload<'static> {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::NoSuchUuid { uuid }
        }
    }

    pub fn no_such_group(seq: usize, group: &str) -> Payload {
        Payload::Status {
            seq: Some(seq),
            data: StatusPayload::NoSuchGroup { group }
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

pub type GroupId<'a> = &'a str;

/// HACK(Avarel): Serde deserialize bugs up when it sees a RawValue in a tagged
/// enum, so we have to reconstruct this and try to deserialize this version
/// first.
///
/// A MESSAGE payload that uses RawValue instead, so that the serialization
/// and deserialization process does not attempt to do anything with
/// the data (saving CPU cycles).
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PayloadMessageRaw<'a> {
    #[serde(rename = "type")]
    pub t: &'a str,
    /// Origin of the message.
    #[serde(skip_deserializing)]
    pub origin: Option<Origin<'a>>,
    /// Target of the message. This can be a single user
    /// (using name or uuid), or a group.
    pub target: Target<'a>,
    /// Data field.
    #[serde(borrow)]
    pub data: &'a RawValue,
}

impl<'a> PayloadMessageRaw<'a> {
    pub fn new(origin: Option<Origin<'a>>, target: Target<'a>, data: &'a RawValue) -> Self {
        PayloadMessageRaw {
            t: "MESSAGE",
            origin,
            target,
            data
        }
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
pub enum Payload<'a> {
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
        data: Value,
    },
    /// Subscribe to a group's broadcast.
    Subscribe { group: GroupId<'a> },
    /// Unsubscribe from a group's broadcast.
    Unsubscribe { group: GroupId<'a> },
    /// Create a group such that every subscriber
    /// will receive the message targeted towards that group.
    CreateGroup { group: GroupId<'a> },
    /// Delete a group. This operation only succeeds if
    /// the client is the group's owner.
    DeleteGroup { group: GroupId<'a> },
    /// This payload asks for all the clients of the
    /// group specified in the data field.
    FetchGroupSubs { group: GroupId<'a> },
    /// This payload asks for all of the groups
    /// registered with the concierge.
    FetchGroupList,
    /// This payload asks for all of the clients
    /// connected to the concierge.
    FetchClientList,
    /// This payload asks for the connecting client's
    /// subscriptions.
    FetchSubs,
    /// This payload is sent upon successful identification.
    /// The payload will also contain a universally unique identifier
    /// that acts as a file server key. The payload also returns
    /// the server's version.
    Hello { uuid: Uuid, version: &'a str },
    /// Returns all of the clients (subscribed to the group) an array of origin structs.
    GroupSubList {
        group: GroupId<'a>,
        clients: Vec<Origin<'a>>,
    },
    /// This payload lists all of the groups registered with the concierge.
    GroupList { groups: Vec<&'a str> },
    /// This payload lists all of the clients registered with the concierge.
    ClientList { clients: Vec<Origin<'a>> },
    /// This payload lists all of the connecting client's subscriptions.
    SubList { groups: Vec<&'a str> },
    /// A payload broadcasted whenever a new client joins. This is not
    /// emitted to newly joining clients.
    ClientJoin {
        #[serde(flatten)]
        data: Origin<'a>,
    },
    /// A payload broadcasted whenever a new client leaves. This is not
    /// emitted to leaving clients.
    ClientLeave {
        #[serde(flatten)]
        data: Origin<'a>,
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

#[derive(Serialize, Deserialize, Copy, Clone, Debug)]
#[serde(tag = "code", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum StatusPayload<'a> {
    Ok,
    MessageSent,
    Subscribed { group: GroupId<'a> },
    Unsubscribed { group: GroupId<'a> },
    GroupCreated { group: GroupId<'a> },
    GroupDeleted { group: GroupId<'a> },
    Bad,
    Unsupported,
    Protocol { desc: &'a str },
    GroupAlreadyCreated { group: GroupId<'a> },
    NoSuchName { name: &'a str },
    NoSuchUuid { uuid: Uuid },
    NoSuchGroup { group: GroupId<'a> }
}

/// An origin receipt for certain payloads.
#[derive(Serialize, Deserialize, Copy, Clone, Debug)]
pub struct Origin<'a> {
    pub name: &'a str,
    pub uuid: Uuid,
    pub group: Option<&'a str>,
}

impl<'a> Origin<'a> {
    pub fn with_group(mut self, group: GroupId<'a>) -> Origin<'a> {
        self.group = Some(group);
        self
    }
}

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
