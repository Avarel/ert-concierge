use serde::{Deserialize, Serialize};
use serde_json::Value;
use crate::clients::ClientType;

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
/// ## Payload to the Concierge
/// ```json
/// { "operation": "FETCH_PLUGINS", "data": { "foo": "bar" }}
/// ```
/// ## Payload from the Concierge
/// ```json
/// { "operation": "HELLO", "data": { "foo": "bar" }}
/// ```
#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "operation", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Payload<'a> {
    // PAYLOADS TO CONCIERGE
    
    /// Identification payload. This payload must be the first payload sent
    /// within 5 seconds of establishing the socket connection, else the
    /// connection will be dropped.
    /// # Example
    /// ```json
    /// { "operation": "IDENTIFY", "data": { "type": "USER", "id": "anthony" }}
    /// { "operation": "IDENTIFY", "data": { "type": "USER", "id": "brendan" }}
    /// { "operation": "IDENTIFY", "data": { "type": "PLUGIN", "id": "simulation" }}
    /// ```
    Identify {
        data: IdentifyData,
    },
    /// Message payloads. These payloads have special fields for targeting
    /// other users or plugins. The origin fields are ignored if they are
    /// sent to the concierge, since the identification process happens
    /// per socket. The data field is transmitted verbatim.
    ///
    /// ## Payload to the Concierge
    /// Imagine that a user identifies as `anthony` sends this to the concierge.
    /// ```json
    /// {
    ///     "operation":"MESSAGE",
    ///     "target_type":"USER",
    ///     "target":{"id":"brendan","type":"USER"},
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
    ///     "origin":{"id":"anthony","type":"USER"},
    ///     "target":{"id":"brendan","type":"USER"},
    ///     "data":{
    ///         "foo": "bar"
    ///     }
    /// }
    /// ```
    Message {
        // Origin of the message.
        #[serde(skip_deserializing)]
        origin: Option<TargetData<'a>>,

        /// Target of the message.
        target: TargetData<'a>,

        // Data field.
        data: Value,
    },
    /// Fetch payload. This payload lists all the clients of the connection
    /// type specified in the data field.
    /// ```json
    /// {"operation":"FETCH_CLIENTS", "client_type": "USER"}
    /// ```
    FetchClients { client_type: ClientType },

    // PAYLOADS FROM CONCIERGE

    /// Hello payload. This payload is sent upon successful identification.
    /// ```json
    /// {"operation":"HELLO"}
    /// ```
    Hello,
    /// Plugins data payload. Returns all the client IDs as an array of strings.
    /// ```json
    /// {"operation":"CLIENTS_DATA", "client_type": "PLUGIN", "data": ["simulation1", "simulation2"]}
    /// ```
    ClientsData {
        client_type: ClientType,
        data: Vec<String>,
    },
    /// Error payload. 
    /// ```json
    /// {"operation":"ERROR", "code": 420, "data": "The cake was a lie."}
    /// ```
    Error {
        code: u16,
        data: &'a str
    }
}

/// Data field for an targetting.
#[derive(Serialize, Deserialize, Clone)]
pub struct TargetData<'a> {
    /// Identification of the target.
    pub id: &'a str,
    /// Type of the target.
    #[serde(rename = "type")]
    pub t: ClientType,
}

/// Data field for an identify payload.
#[derive(Serialize, Deserialize, Clone)]
pub struct IdentifyData {
    /// Identification of the client.
    pub id: String,
    /// Type of the client.
    #[serde(rename = "type")]
    pub t: ClientType,
}