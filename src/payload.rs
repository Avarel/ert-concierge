use serde::{Deserialize, Serialize};
use serde_json::Value;
use crate::concierge::ClientType;

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
#[derive(Serialize, Deserialize)]
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
    ///     "target":"brendan",
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
    ///     "origin_type":"USER",
    ///     "origin":"anthony",
    ///     "target_type":"USER",
    ///     "target":"brendan",
    ///     "data":{
    ///         "foo": "bar"
    ///     }
    /// }
    /// ```
    Message {
        // Origin of the message.
        #[serde(skip_deserializing)]
        origin_type: Option<ClientType>,
        #[serde(skip_deserializing)]
        origin: Option<&'a str>,

        /// Target of the message.
        target_type: ClientType,
        target: &'a str,

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

/// Data field for an identify payload.
#[derive(Serialize, Deserialize)]
pub struct IdentifyData {
    /// Identification of the client.
    pub id: String,
    /// Type of the client.
    #[serde(rename = "type")]
    pub t: ClientType,
}