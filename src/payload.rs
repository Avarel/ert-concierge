use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;
use std::collections::HashSet;

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
        data: "Target does not exist",
    };

    pub const ALREADY_EXIST: Payload = Payload::Error {
        code: 4004,
        data: "Already exist",
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
    /*
     * PAYLOADS TO THE CONCIERGE
     */
    /// This payload must be the first payload sent
    /// within 5 seconds of establishing the socket connection, else the
    /// connection will be dropped.
    ///
    /// # Example
    /// ```json
    /// { "operation": "IDENTIFY", "name": "anthony" }
    /// { "operation": "IDENTIFY", "name": "brendan" }
    /// { "operation": "IDENTIFY", "name": "simulation" }
    /// ```
    Identify { name: &'a str },
    /// These payloads have special fields for targeting
    /// other users or plugins. The origin fields are ignored if they are
    /// sent to the concierge, since the identification process happens
    /// per socket. The data field is transmitted verbatim.
    ///
    /// # Example
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
    ///
    /// # Example
    /// ```json
    /// {
    ///     "operation":"SUBSCRIBE",
    ///     "group":"simulation1_data"
    /// }
    /// ```
    Subscribe { group: GroupId<'a> },
    /// Unsubscribe from a group's broadcast.
    ///
    /// # Example
    /// ```json
    /// {
    ///     "operation":"UNSUBSCRIBE",
    ///     "group":"simulation1_data"
    /// }
    /// ```
    Unsubscribe { group: GroupId<'a> },
    /// Broadcast to every client connected to the concierge.
    ///
    /// # Example
    /// ## Payload to the Concierge
    /// Imagine that a user identifies as `anthony` sends this to the concierge.
    /// ```json
    /// {
    ///     "operation":"BROADCAST",
    ///     "data":{
    ///         "foo": "bar"
    ///     }
    /// }
    /// ```
    /// ## Payload from the Concierge
    /// The user `brendan` will receive this on their end.
    /// ```json
    /// {
    ///     "operation":"BROADCAST",
    ///     "origin":{"name":"anthony","uuid":"..."},
    ///     "data":{
    ///         "foo": "bar"
    ///     }
    /// }
    /// ```
    Broadcast {
        // Origin of the message.
        #[serde(skip_deserializing)]
        origin: Option<Origin<'a>>,
        // Data field.
        data: Value,
    },
    /// Create a group such that every subscriber
    /// will receive the message targeted towards that group.
    ///
    /// # Example
    /// ```json
    /// { "operation":"CREATE_GROUP", "group":"simulation1_data" }
    /// ```
    CreateGroup { group: GroupId<'a> },
    /// Delete a group. This operation only succeeds if
    /// the client is the group's owner.
    ///
    /// # Example
    /// ```json
    /// { "operation":"DELETE_GROUP", "group":"simulation1_data" }
    /// ```
    DeleteGroup { group: GroupId<'a> },
    /// This payload asks for all the clients of the
    /// group specified in the data field.
    ///
    /// # Example
    /// ```json
    /// {
    ///     "operation":"FETCH_GROUP_SUBS",
    ///     "group":"users"
    /// }
    /// ```
    FetchGroupSubs { group: GroupId<'a> },
    /// This payload asks for all of the groups
    /// registered with the concierge.
    ///
    /// # Example
    /// ```json
    /// { "operation":"FETCH_GROUP_LIST" }
    /// ```
    FetchGroupList,
    /// This payload asks for all of the clients
    /// connected to the concierge.
    ///
    /// # Example
    /// ```json
    /// { "operation":"FETCH_CLIENT_LIST" }
    /// ```
    FetchClientList,
    /// This payload asks for the connecting client's
    /// subscriptions.
    ///
    /// # Example
    /// ```json
    /// { "operation":"FETCH_SUBS" }
    /// ```
    FetchSubs,
    
    FileUpload,

    FileId,

    /*
     * PAYLOADS FROM THE CONCIERGE
     */
    /// This payload is sent upon successful identification.
    /// The payload will also contain a universally unique identifier
    /// that acts as a file server key.
    ///
    /// # Example
    /// ```json
    /// {
    ///     "operation":"HELLO",
    ///     "uuid":"73fcc768-d724-47e2-a101-a45298188f47"
    /// }
    /// ```
    Hello { uuid: Uuid },
    /// Returns all the client names as an array of strings.
    ///
    /// # Example
    /// ```json
    /// {
    ///     "operation":"GROUP_SUBS",
    ///     "group":"plugins",
    ///     "clients":[
    ///         {
    ///             "name":"simulation1",
    ///             "uuid":"..."
    ///         },
    ///         {
    ///             "name":"simulation2",
    ///             "uuid":"..."
    ///         }
    ///     ]
    /// }
    /// ```
    GroupSubs {
        group: GroupId<'a>,
        clients: Vec<OwnedOrigin>,
    },
    /// This payload lists all of the groups registered with the concierge.
    ///
    /// # Example
    /// ```json
    /// {"operation":"GROUP_LIST","groups":["simulation1", "simulation2"]}
    /// ```
    GroupList { groups: Vec<String> },
    /// This payload lists all of the clients registered with the concierge.
    ///
    /// # Example
    /// ```json
    /// {
    ///     "operation":"CLIENT_LIST",
    ///     "clients":[
    ///         {
    ///             "name":"simulation1",
    ///             "uuid":"..."
    ///         },
    ///         {
    ///             "name":"simulation2",
    ///             "uuid":"..."
    ///         },
    ///         {
    ///             "name":"anthony",
    ///             "uuid":"..."
    ///         },
    ///         {
    ///             "name":"brendan",
    ///             "uuid":"..."
    ///         }
    ///     ]
    /// }
    /// ```
    ClientList { clients: Vec<OwnedOrigin> },
    /// This payload lists all of the connecting client's subscriptions.
    ///
    /// # Example
    /// ```json
    /// {"operation":"SUBS","groups":["simulation1"]}
    /// ```
    Subs { groups: HashSet<String> },
    /// A payload broadcasted whenever a new client joins. This is not
    /// emitted to newly joining clients.
    ///
    /// # Example
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
    ///
    /// # Example
    /// ```json
    /// { "operation": "CLIENT_LEAVE", "name": "brendan" }
    /// { "operation": "CLIENT_LEAVE", "name": "simulation" }
    /// ```
    ClientLeave {
        #[serde(flatten)]
        data: Origin<'a>,
    },
    /// Error payload.
    ///
    /// # Example
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

/// Origin but the name field is owned.
#[derive(Serialize, Deserialize, Clone)]
pub struct OwnedOrigin {
    pub name: String,
    pub uuid: Uuid,
}

/// An origin receipt for certain payloads.
#[derive(Serialize, Deserialize, Copy, Clone)]
pub struct Origin<'a> {
    pub name: &'a str,
    pub uuid: Uuid,
}

#[derive(Serialize, Deserialize, Copy, Clone)]
#[serde(rename_all = "snake_case")]
pub enum Target<'a> {
    /// Target a client name.
    Name(&'a str),
    /// Target a client Uuid.
    Uuid(Uuid),
    /// Target a group name.
    Group(GroupId<'a>),
}
