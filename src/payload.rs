use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

pub mod error_payloads {
    use super::Payload;

    #[allow(dead_code)]
    pub const UNKNOWN: Payload = Payload::Error {
        code: 4000,
        data: "Unknown error",
    };

    pub const UNSUPPORTED: Payload = Payload::Error {
        code: 4001,
        data: "Unsupported payload",
    };

    pub const PROTOCOL: Payload = Payload::Error {
        code: 4002,
        data: "Protocol error",
    };

    pub const INVALID_TARGET: Payload = Payload::Error {
        code: 4003,
        data: "Invalid target",
    };
}

pub mod close_codes {
    #[allow(dead_code)]
    pub const UNKNOWN: u16 = 4000;
    pub const FATAL_DECODE: u16 = 4002;
    pub const NO_AUTH: u16 = 4003;
    pub const AUTH_FAILED: u16 = 4004;
    pub const DUPLICATE_AUTH: u16 = 4005;
}

pub type Group<'a> = &'a str;

/// Packets sent from the client to the Gateway API are encapsulated within a
/// gateway payload object and must have the proper operation and data object set.
///
/// The `target` field can either be a plugin id or a user id, depending
/// on the `operation`. The `data` field is always a JSON object that can take on
/// any form, as it will be transmitted verbatim to the target. The `origin`
/// is ignored when a message is sent to the concierge. The concierge will
/// always relay the message with a proper origin set.
///
/// # Example
/// ```json
/// { "operation": "ABCDEFG", "data": { "foo": "bar" }}
/// ```
#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "operation", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Payload<'a> {
    // PAYLOADS TO CONCIERGE
    /// This payload must be the first payload sent
    /// within 5 seconds of establishing the socket connection, else the
    /// connection will be dropped.
    /// # Example
    /// ```json
    /// { "operation": "IDENTIFY", "name": "anthony" }
    /// { "operation": "IDENTIFY", "name": "brendan" }
    /// { "operation": "IDENTIFY", "name": "simulation" }
    /// ```
    Identify {
        name: &'a str,
    },
    /// These payloads have special fields for targeting
    /// other users or plugins. The origin fields are ignored if they are
    /// sent to the concierge, since the identification process happens
    /// per socket. The data field is transmitted verbatim.
    ///
    /// ## Payload to the Concierge
    /// Imagine that a user identifies as `anthony` sends this to the concierge.
    /// ```json
    /// {
    ///     "operation":"MESSAGE",
    ///     "name": "brendan",
    ///     "data":{
    ///         "foo": "bar"
    ///     }
    /// }
    /// ```
    /// ## Payload from the Concierge
    /// The user `brendan` will receive this on their end.
    /// ```json
    /// {
    ///     "operation":"MESSAGE",
    ///     "origin":{"name":"anthony","uuid":"..."},
    ///     "name": "brendan",
    ///     "data":{
    ///         "foo": "bar"
    ///     }
    /// }
    /// ```
    Message {
        /// Origin of the message.
        #[serde(skip_deserializing)]
        origin: Option<Origin<'a>>,
        /// Target of the message. This can be a single user 
        /// (using name or uuid), or a group.
        #[serde(flatten)]
        target: Target<'a>,
        /// Data field.
        data: Value,
    },
    /// Subscribe to a group's broadcast.
    Subscribe {
        group: Group<'a>,
    },
    /// Unsubscribe from a group's broadcast.
    Unsubscribe {
        group: Group<'a>,
    },
    /// Broadcast to every client.
    Broadcast {
        // Origin of the message.
        #[serde(skip_deserializing)]
        origin: Option<Origin<'a>>,
        // Data field.
        data: Value,
    },
    /// This payload asks for all the clients of the
    /// group specified in the data field.
    /// ```json
    /// {"operation":"FETCH_GROUP_SUBS","group": "USER"}
    /// ```
    FetchGroupSubs {
        group: Group<'a>,
    },
    /// This payload asks for all of the groups
    /// registered with the concierge.
    FetchGroupList,
    /// This payload asks for all of the clients
    /// connected to the concierge.
    FetchClientList,
    /// This payload asks for the connecting client's
    /// subscriptions.
    FetchSubs,

    // PAYLOADS FROM CONCIERGE
    /// This payload is sent upon successful identification.
    /// The payload will also contain a universally unique identifier
    /// that acts as a file server key.
    /// ```json
    /// {"operation":"HELLO","uuid":"73fcc768-d724-47e2-a101-a45298188f47"}
    /// ```
    Hello {
        uuid: Uuid,
    },
    /// Returns all the client names as an array of strings.
    /// ```json
    /// {"operation":"GROUP_SUBS","group":"PLUGIN","names":["simulation1","simulation2"],"uuids":["...","..."]}
    /// ```
    GroupSubs {
        /// The client's group.
        group: Group<'a>,
        /// Names of the clients of the queried type.
        names: Vec<String>,
        /// UUIDs of the clients of the queried type.
        uuids: Vec<Uuid>,
    },
    /// This payload lists all of the groups registered with the concierge.
    GroupList {
        groups: Vec<String>,
    },
    /// This payload lists all of the clients registered with the concierge.
    ClientList {
        names: Vec<String>,
        /// UUIDs of the clients of the queried type.
        uuids: Vec<Uuid>,
    },
    /// This payload lists all of the connecting client's subscriptions.
    Subs {
        groups: Vec<String>,
    },
    /// A payload broadcasted whenever a new client joins. This is not
    /// emitted to newly joining clients.
    /// ```json
    /// { "operation": "CLIENT_JOIN", "group": "USER", "name": "anthony" }
    /// { "operation": "CLIENT_JOIN", "group": "PLUGIN", "name": "simulation" }
    /// ```
    ClientJoin {
        #[serde(flatten)]
        data: Origin<'a>,
    },
    /// A payload broadcasted whenever a new client leaves. This is not
    /// emitted to leaving clients.
    /// ```json
    /// { "operation": "CLIENT_LEAVE", "group": "USER", "name": "brendan" }
    /// { "operation": "CLIENT_LEAVE", "group": "PLUGIN", "name": "simulation" }
    /// ```
    ClientLeave {
        #[serde(flatten)]
        data: Origin<'a>,
    },
    /// Error payload.
    /// ```json
    /// {"operation":"ERROR", "code": 420, "data": "The cake was a lie."}
    /// ```
    Error {
        /// Error code.
        code: u16,
        /// Error message.
        data: &'a str,
    },
}

#[derive(Serialize, Deserialize, Copy, Clone)]
pub struct Origin<'a> {
    /// Identification of the client.
    pub name: &'a str,
    pub uuid: Uuid,
}

#[derive(Serialize, Deserialize, Copy, Clone)]
#[serde(rename_all = "snake_case")]
pub enum Target<'a> {
    Name(&'a str),
    Uuid(Uuid),
    Group(Group<'a>),
}
