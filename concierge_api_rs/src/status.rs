use crate::payload::{ClientPayload, GroupId, GroupPayload};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Status structs.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "code", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum StatusPayload<'a> {
    /// A payload broadcasted whenever a new client joins. This is not
    /// emitted to newly joining clients.
    ClientJoined {
        #[serde(flatten)]
        client: ClientPayload<'a>,
    },
    /// A payload broadcasted whenever a new client leaves. This is not
    /// emitted to leaving clients.
    ClientLeft {
        #[serde(flatten)]
        client: ClientPayload<'a>,
    },
    /// Generic OK.
    Ok,
    /// Indicates that a message has been sent successfully.
    MessageSent,
    /// Indicates that the client is now subscribed to a group.
    SelfSubscribed { 
        #[serde(flatten)]
        group: GroupPayload<'a>
    },
    /// Indicates that the client is already subscribed to a group.
    SelfAlreadySubscribed { 
        #[serde(flatten)]
        group: GroupPayload<'a>
    },
    /// Indicates that the client is not subscribed to a group.
    SelfNotSubscribed { 
        #[serde(flatten)]
        group: GroupPayload<'a>
    },
    /// Indicates that the client is no longer subscribed to a group.
    /// May not be attached with a sequence number if the client did not send
    /// an UNSUBSCRIBE payload to unsubscribe from this group.
    SelfUnsubscribed { 
        #[serde(flatten)]
        group: GroupPayload<'a>
    },
    /// Indicates that a new group has been created.
    /// May not be attached with a sequence number if the client did not send
    /// a CREATE_GROUP payload to create this group.
    GroupCreated { 
        #[serde(flatten)]
        group: GroupPayload<'a>
    },
    /// Indicates that a group has been deleted.
    /// May not be attached with a sequence number if the client did not send
    /// a DELETE_GROUP payload to delete this group.
    GroupDeleted { 
        #[serde(flatten)]
        group: GroupPayload<'a>
    },
    /// Generic BAD payload.
    Bad,
    /// Internal error payload.
    Internal { desc: &'a str },
    /// Indicates that the "type" of the incoming payload is not supported.
    /// An example would be trying to send a well-formed HELLO payload
    /// to the concierge.
    Unsupported,
    /// Indicates that the concierge has failed to decode the payload
    /// due to some reason (reported by serde).
    Protocol { desc: &'a str },
    /// Indicates that the group has already been created.
    /// This is sent in response to GROUP_CREATE payload.
    GroupAlreadyCreated { 
        #[serde(flatten)]
        group: GroupPayload<'a>
    },
    /// Indicates that no such name exists in the namespace of the conciergee.
    NoSuchName { name: &'a str },
    /// Indicates that the Uuid is unrecognized by the concierge.
    NoSuchUuid { uuid: Uuid },
    /// Indicates that the group name is not registered with the concierge.
    NoSuchGroup { name: GroupId<'a> },
}

/// Utility methods to create good statuses.
pub mod ok {
    use super::StatusPayload;
    use crate::{payload::GroupPayload, JsonPayload};

    #[allow(dead_code)]
    pub const fn ok() -> JsonPayload<'static> {
        JsonPayload::Status {
            data: StatusPayload::Ok,
        }
    }

    pub const fn message_sent() -> JsonPayload<'static> {
        JsonPayload::Status {
            data: StatusPayload::MessageSent,
        }
    }

    pub fn subscribed(group: GroupPayload<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::SelfSubscribed { group },
        }
    }

    pub const fn unsubscribed(group: GroupPayload<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::SelfUnsubscribed { group },
        }
    }

    pub const fn created_group(group: GroupPayload<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::GroupCreated { group },
        }
    }

    pub const fn deleted_group(group: GroupPayload<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::GroupDeleted { group },
        }
    }
}

/// Utility methods to create bad statuses.
pub mod err {
    use super::StatusPayload;
    use crate::{payload::GroupPayload, JsonPayload};
    use uuid::Uuid;

    #[allow(dead_code)]
    pub const fn bad() -> JsonPayload<'static> {
        JsonPayload::Status {
            data: StatusPayload::Bad,
        }
    }

    pub const fn internal(desc: &str) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::Internal { desc },
        }
    }

    pub const fn unsupported() -> JsonPayload<'static> {
        JsonPayload::Status {
            data: StatusPayload::Unsupported,
        }
    }

    pub const fn protocol(desc: &str) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::Protocol { desc },
        }
    }

    pub const fn group_already_created(group: GroupPayload<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::GroupAlreadyCreated { group },
        }
    }

    pub fn already_subscribed(group: GroupPayload<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::SelfAlreadySubscribed { group },
        }
    }

    pub const fn not_subscribed(group: GroupPayload<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::SelfNotSubscribed { group },
        }
    }

    pub const fn no_such_name(name: &str) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::NoSuchName { name },
        }
    }

    pub const fn no_such_uuid(uuid: Uuid) -> JsonPayload<'static> {
        JsonPayload::Status {
            data: StatusPayload::NoSuchUuid { uuid },
        }
    }

    pub const fn no_such_group(name: &str) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::NoSuchGroup { name },
        }
    }
}
