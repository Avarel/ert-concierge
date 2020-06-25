use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashSet;
use uuid::Uuid;

pub mod ok {
    use super::Payload;
    use serde_json::Value;

    #[allow(dead_code)]
    pub const fn ok() -> Payload<'static> {
        Payload::Status {
            code: 2000,
            data: None,
        }
    }

    pub const fn message_sent() -> Payload<'static> {
        Payload::Status {
            code: 2001,
            data: None,
        }
    }

    pub fn subscribed(group: &str) -> Payload {
        Payload::Status {
            code: 2002,
            data: Some(Value::String(group.to_owned())),
        }
    }

    pub fn unsubscribed(group: &str) -> Payload {
        Payload::Status {
            code: 2003,
            data: Some(Value::String(group.to_owned())),
        }
    }

    pub fn created_group(group: &str) -> Payload {
        Payload::Status {
            code: 2004,
            data: Some(Value::String(group.to_owned())),
        }
    }

    pub fn deleted_group(group: &str) -> Payload {
        Payload::Status {
            code: 2005,
            data: Some(Value::String(group.to_owned())),
        }
    }
}

pub mod err {
    use super::Payload;
    use serde_json::Value;
    use uuid::Uuid;

    #[allow(dead_code)]
    pub const fn bad() -> Payload<'static> {
        Payload::Status {
            code: 4000,
            data: None,
        }
    }

    pub const fn unsupported() -> Payload<'static> {
        Payload::Status {
            code: 4001,
            data: None,
        }
    }

    pub const fn protocol() -> Payload<'static> {
        Payload::Status {
            code: 4002,
            data: None,
        }
    }

    pub fn group_already_created(group: &str) -> Payload {
        Payload::Status {
            code: 4003,
            data: Some(Value::String(group.to_owned())),
        }
    }

    pub fn no_such_name(name: &str) -> Payload {
        Payload::Status {
            code: 4004,
            data: Some(Value::String(name.to_owned())),
        }
    }

    pub fn no_such_uuid(uuid: Uuid) -> Payload<'static> {
        Payload::Status {
            code: 4005,
            data: Some(Value::String(uuid.to_string())),
        }
    }

    pub fn no_such_group(group: &str) -> Payload {
        Payload::Status {
            code: 4006,
            data: Some(Value::String(group.to_owned())),
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
}

pub type GroupId<'a> = &'a str;

/// Packets sent from the client to the Gateway API are encapsulated within a
/// gateway payload object and must have the proper operation and data object set.
///
/// # Example
/// ```json
/// { "operation": "ABCDEFG", "data": { "foo": "bar" }}
/// ```
#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "operation", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Payload<'a> {
    /// This payload must be the first payload sent
    /// within 5 seconds of establishing the socket connection, else the
    /// connection will be dropped.
    Identify { name: &'a str },
    /// These payloads have special fields for targeting
    /// other users or plugins. The origin fields are ignored if they are
    /// sent to the concierge, since the identification process happens
    /// per socket. The data field is transmitted verbatim.
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
    /// Broadcast to every client connected to the concierge.
    Broadcast {
        // Origin of the message.
        #[serde(skip_deserializing)]
        origin: Option<Origin<'a>>,
        // Data field.
        data: Value,
    },
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
    /// that acts as a file server key.
    Hello { uuid: Uuid },
    /// Returns all the client (subscribed to the group) names as an array of strings.
    GroupSubs {
        group: GroupId<'a>,
        clients: Vec<Origin<'a>>,
    },
    /// This payload lists all of the groups registered with the concierge.
    GroupList { groups: Vec<&'a str> },
    /// This payload lists all of the clients registered with the concierge.
    ClientList { clients: Vec<Origin<'a>> },
    /// This payload lists all of the connecting client's subscriptions.
    Subs { groups: HashSet<String> },
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
        /// Error code.
        code: u16,
        /// Error message.
        data: Option<Value>,
    },
}

/// An origin receipt for certain payloads.
#[derive(Serialize, Deserialize, Copy, Clone)]
pub struct Origin<'a> {
    pub name: &'a str,
    pub uuid: Uuid,
}

#[derive(Serialize, Deserialize, Copy, Clone)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Target<'a> {
    /// Target a client name.
    Name { name: &'a str },
    /// Target a client Uuid.
    Uuid { uuid: Uuid },
    /// Target a group name.
    Group { group: GroupId<'a> },
}
