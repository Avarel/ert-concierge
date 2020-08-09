use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::{ServiceId, info::Origin};

/// Targetting directive for message payloads.
#[derive(Serialize, Deserialize, Copy, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Target<'a> {
    /// Target a client by their name.
    ///
    /// ### Response
    /// * `INVALID_NAME`: The target client does not exist by that name.
    Name { name: &'a str },
    /// Target a client by their uuid.
    ///
    /// ### Response
    /// * `INVALID_UUID`: The target client does not exist by that uuid.
    Uuid { uuid: Uuid },
    /// Target a service by its name.
    ///
    /// ### Response
    /// * `BAD`: Insufficient permission to use this target.
    /// * `INVALID_SERVICE`: The service does not exist by that name.
    Service { service: ServiceId<'a> },
    /// Target a service's subscribing client by their uuid
    /// This can only be used by a service's owner.
    ///
    /// ### Response
    /// * `BAD`: Insufficient permission to use this target.
    /// * `INVALID_SERVICE`: The service does not exist by that name.
    ServiceClientUuid { service: ServiceId<'a>, uuid: Uuid },
    /// Target every client connected to the concierge.
    All,
}

/// Mimics a constant field for type safe deserialization.
#[derive(Serialize, Deserialize, Copy, Clone, Debug)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
enum PayloadMessageType {
    Message,
}

/// These payloads have special fields for targeting other users or services.
/// The origin fields are ignored if they are sent to the server. The data
/// is transmitted verbatim.
///
/// ### Responses
/// * `OK`: Message have been sent.
/// * `BAD`: Insufficient permission to use this target.
/// * `INVALID_NAME`: The target client does not exist by that name.
/// * `INVALID_UUID`: The target client does not exist by that uuid.
/// * `INVALID_SERVICE`: The service does not exist by that name.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PayloadMessage<'a, T> {
    /// Mimics the "type" tag of Payload. This should always be PayloadRawType::Message.
    r#type: PayloadMessageType,
    /// Origin of the message.
    pub origin: Option<Origin<'a>>,
    /// Target of the message. This can be a single user
    /// (using name or uuid), or a service.
    #[serde(borrow)]
    pub target: Target<'a>,
    /// Data field. This is a raw JSON value field that borrows the JSON
    /// string directly from the deserialized buffer.
    pub data: T,
}

impl<'a, T> PayloadMessage<'a, T> {
    /// Construct a new payload message.
    pub fn new(target: Target<'a>, data: T) -> Self {
        PayloadMessage {
            r#type: PayloadMessageType::Message,
            origin: None,
            target,
            data,
        }
    }

    /// Attach an origin field to the message payload.
    pub fn with_origin(mut self, origin: Origin<'a>) -> Self {
        self.origin = Some(origin);
        self
    }
}