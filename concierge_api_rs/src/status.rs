use crate::payload::{ClientPayload, GroupId};
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
    use super::StatusPayload;
    use crate::JsonPayload;

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
    use super::StatusPayload;
    use crate::JsonPayload;
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
