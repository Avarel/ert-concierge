use crate::payload::{ClientInfo, ServiceId, ServiceInfo};
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
        client: ClientInfo<'a>,
    },
    /// A payload broadcasted whenever a client leaves. This is not
    /// emitted to leaving clients.
    ClientLeft {
        #[serde(flatten)]
        client: ClientInfo<'a>,
    },
    /// Generic OK.
    Ok,
    /// Indicates that a message has been sent successfully.
    MessageSent,
    /// Indicates that the client is now subscribed to a group.
    SelfSubscribed { 
        #[serde(flatten)]
        service: ServiceInfo<'a>
    },
    /// Indicates that the client is already subscribed to a group.
    SelfAlreadySubscribed { 
        #[serde(flatten)]
        service: ServiceInfo<'a>
    },
    /// Indicates that the client is not subscribed to a group.
    SelfNotSubscribed { 
        #[serde(flatten)]
        service: ServiceInfo<'a>
    },
    /// Indicates that the client is no longer subscribed to a group.
    /// May not be attached with a sequence number if the client did not send
    /// an UNSUBSCRIBE payload to unsubscribe from this group.
    SelfUnsubscribed { 
        #[serde(flatten)]
        service: ServiceInfo<'a>
    },
    /// Indicates that a new group has been created.
    /// May not be attached with a sequence number if the client did not send
    /// a CREATE_GROUP payload to create this group.
    ServiceCreated { 
        #[serde(flatten)]
        service: ServiceInfo<'a>
    },
    /// Indicates that the group has already been created.
    /// This is sent in response to GROUP_CREATE payload.
    ServiceAlreadyCreated { 
        #[serde(flatten)]
        service: ServiceInfo<'a>
    },
    /// Indicates that a group has been deleted.
    /// May not be attached with a sequence number if the client did not send
    /// a DELETE_GROUP payload to delete this group.
    ServiceDeleted { 
        #[serde(flatten)]
        service: ServiceInfo<'a>
    },
    /// A payload broadcasted to the service when a new client subscribes
    /// to the service.
    ServiceClientSubscribed {
        #[serde(flatten)]
        client: ClientInfo<'a>,
        service: ServiceInfo<'a>
    },
    /// A payload broadcasted to the service when a client unsubscribes
    /// from the service.
    ServiceClientUnsubscribed {
        #[serde(flatten)]
        client: ClientInfo<'a>,
        service: ServiceInfo<'a>
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
    /// Indicates that no such name exists in the namespace of the conciergee.
    NoSuchName { name: &'a str },
    /// Indicates that the Uuid is unrecognized by the concierge.
    NoSuchUuid { uuid: Uuid },
    /// Indicates that the group name is not registered with the concierge.
    NoSuchService { name: ServiceId<'a> },
}

/// Utility methods to create good statuses.
pub mod ok {
    use super::StatusPayload;
    use crate::{payload::{ClientInfo, ServiceInfo}, JsonPayload};

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

    pub fn self_subscribed(service: ServiceInfo<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::SelfSubscribed { service },
        }
    }

    pub const fn self_unsubscribed(service: ServiceInfo<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::SelfUnsubscribed { service },
        }
    }

    pub const fn service_created(service: ServiceInfo<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::ServiceCreated { service },
        }
    }

    pub const fn service_deleted(service: ServiceInfo<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::ServiceDeleted { service },
        }
    }

    pub const fn service_client_subscribed<'a>(client: ClientInfo<'a>, service: ServiceInfo<'a>) -> JsonPayload<'a> {
        JsonPayload::Status {
            data: StatusPayload::ServiceClientSubscribed { 
                client, 
                service 
            }
        }
    }

    pub const fn service_client_unsubscribed<'a>(client: ClientInfo<'a>, service: ServiceInfo<'a>) -> JsonPayload<'a> {
        JsonPayload::Status {
            data: StatusPayload::ServiceClientUnsubscribed { 
                client, 
                service 
            }
        }
    }
}

/// Utility methods to create bad statuses.
pub mod err {
    use super::StatusPayload;
    use crate::{payload::ServiceInfo, JsonPayload};
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

    pub const fn group_already_created(service: ServiceInfo<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::ServiceAlreadyCreated { service },
        }
    }

    pub fn self_already_subscribed(service: ServiceInfo<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::SelfAlreadySubscribed { service },
        }
    }

    pub const fn self_not_subscribed(service: ServiceInfo<'_>) -> JsonPayload {
        JsonPayload::Status {
            data: StatusPayload::SelfNotSubscribed { service },
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
            data: StatusPayload::NoSuchService { name },
        }
    }
}
