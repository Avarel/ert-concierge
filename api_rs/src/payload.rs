use crate::{
    info::{Client, Service},
    ServiceId,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// `PayloadIn` represents the types of payloads that the central server
/// is expected to respond to. All payloads are expected to be tagged with
/// a `type` field indicating it's nature, with the value being in
/// SCREAMING_SNAKE_CASE.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PayloadIn<'a> {
    /// The server expects this payload to be sent within 5 seconds of
    /// establishing the socket connection, to avoid the connection be dropped.
    ///
    /// ### Responses
    /// * `HELLO`: Upon successful identification.
    /// * Socket close: Upon unsuccessful identification.
    Identify {
        name: &'a str,
        nickname: Option<&'a str>,
        version: &'a str,
        secret: Option<&'a str>,
        #[serde(default)]
        tags: Vec<&'a str>,
    },
    /// The client sends this to subscribe to a specific service.
    /// Being subscribed to a service means receiving all messages the owner
    /// of the service sends to that service. A client subscribed to a service
    /// can also send a message to the service, which will be relayed to the
    /// owner only.
    ///
    /// ### Responses
    /// * `INVALID_SERVICE`: The service does not exist by that name.
    /// * `SELF_SUBSCRIBE_RESULT`: See `PayloadOut::SelfSubscribeResult`.
    SelfSubscribe { service: ServiceId<'a> },
    /// The client sends this to unsubscribe from a specific service.
    ///
    /// ### Responses
    /// * `INVALID_SERVICE`: The service does not exist by that name.
    /// * `SELF_UNSUBSCRIBE_RESULT`: See `PayloadOut::SelfUnsubscribeResult`.
    SelfUnsubscribe { service: ServiceId<'a> },
    /// The client sends this to fetch information about its state
    /// on the central server.
    ///
    /// ### Responses
    /// * `SELF_FETCH_RESULT`: See `PayloadOut::SelfFetchResult`.
    SelfFetch,
    /// The client sends this to set the sequence number counter
    /// of the client on the server to the provided number.
    ///
    /// ### Responses
    /// * `OK`: Successfully reset the sequence number.
    SelfSetSeq { seq: usize },
    /// The client sends this to create a service.
    ///
    /// ### Responses
    /// * `SERVICE_CREATE_RESULT`: See `PayloadOut::ServiceCreateResult`.
    ServiceCreate {
        service: ServiceId<'a>,
        nickname: Option<&'a str>,
    },
    /// The client sends this to create a service.
    ///
    /// ### Responses
    /// * `INVALID_SERVICE`: The service does not exist by that name.
    /// * `BAD`: The client is not the owner of that service.
    /// * `SERVICE_CREATE_RESULT`: See `PayloadOut::ServiceCreateResult`.
    ServiceDelete { service: ServiceId<'a> },
    /// The client sends this to fetch information of a specific service.
    ///
    /// ### Responses
    /// * `INVALID_SERVICE`: The service does not exist by that name.
    /// * `SERVICE_FETCH_RESULT`: See `PayloadOut::ServiceFetchResult`.
    ServiceFetch { service: ServiceId<'a> },
    /// The client sends this to fetch information of all services on the server.
    ///
    /// ### Responses
    /// * `SERVICE_FETCH_ALL_RESULT`: See `PayloadOut::ServiceFetchAllResult`.
    ServiceFetchAll,
    /// The client sends this to fetch information about another client by their UUID.
    ///
    /// ### Responses
    /// * `CLIENT_FETCH_RESULT`: See `PayloadOut::SelfFetchResult`.
    ClientFetch { uuid: Uuid } ,
    /// The client sends this to fetch information of all clients on the server.
    ///
    /// ### Responses
    /// * `CLIENT_FETCH_ALL_RESULT`: See `PayloadOut::ClientFetchAllResult`.
    ClientFetchAll,
}

/// `PayloadOut` represents the types of payloads sent from the server.
/// All payloads are expected to be tagged with a `type` field indicating
/// it's nature, with the value being in SCREAMING_SNAKE_CASE.
///
/// Many of these payloads are also attached with a sequence number.
/// For more information, see `SequencedPayloadOut`.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PayloadOut<'a> {
    /// Generic OK payload.
    Ok,
    /// Generic BAD payload.
    Bad,
    /// This server sends this upon successful identification.
    /// The payload will also contain a universally unique identifier
    /// that acts as a file server key. The payload also returns
    /// the server's version.
    Hello { uuid: Uuid, version: &'a str },
    /// The server sends this in response to `SELF_SUBSCRIBE`.
    ///
    /// ### Notes
    /// The payload contains a `successful` boolean flag that indicates
    /// if a the client subscribed to a new service (true) or is already
    /// subscribed to that service (false).
    SelfSubscribeResult {
        successful: bool,
        #[serde(borrow)]
        service: Service<'a>,
    },
    /// The server sends this in response to `SELF_UNSUBSCRIBE`.
    ///
    /// ### Notes
    /// The payload contains a `successful` boolean flag that indicates
    /// if a the client unsubscribed from a service (true) or was not subscribed
    /// to that service (false).
    SelfUnsubscribeResult {
        successful: bool,
        #[serde(borrow)]
        service: Service<'a>,
    },
    /// The server sends this in response to `SELF_FETCH`.
    ///
    /// ### Notes
    /// The subscription of the client is available as an array of service
    /// information objects.
    SelfFetchResult {
        #[serde(borrow)]
        client: Client<'a>,
        #[serde(borrow)]
        subscriptions: Vec<Service<'a>>,
    },
    /// The server sends this in response to `SERVICE_CREATE`.
    ///
    /// The payload contains a `successful` boolean flag that indicates
    /// if a new service was created (true) or a service by that name
    /// already exists (false).
    ///
    /// ### Notes
    /// If `successful` is true, then this payload is also broadcasted to
    /// every client connected to the server.
    ServiceCreateResult {
        successful: bool,
        #[serde(borrow)]
        service: Service<'a>,
    },
    /// The server sends this in response to `SERVICE_DELETE`.
    ///
    /// ### Notes
    /// If this is sent, it means that the service is unambiguously deleted
    /// on the server. This payload is broadcasted to every client connected
    /// to the server.
    ServiceDeleteResult {
        #[serde(borrow)]
        service: Service<'a>,
    },
    /// The server sends this in response to `SERVICE_FETCH`.
    ServiceFetchResult {
        #[serde(borrow)]
        service: Service<'a>,
    },
    /// The server sends this in response to `SERVICE_FETCH_ALL`.
    ///
    /// ### Notes
    /// The services are available as an array of service information objects.
    ServiceFetchAllResult {
        #[serde(borrow)]
        services: Vec<Service<'a>>,
    },
    /// The server sends this in response to `CLIENT_FETCH`.
    ///
    /// ### Notes
    /// The subscription of the client is available as an array of service
    /// information objects.
    ClientFetchResult {
        #[serde(borrow)]
        client: Client<'a>,
        #[serde(borrow)]
        subscriptions: Vec<Service<'a>>,
    },
    /// The server sends this in response to `CLIENT_FETCH_ALL`.
    ///
    /// ### Notes
    /// The clients are available as an array of client information objects.
    ClientFetchAllResult {
        #[serde(borrow)]
        clients: Vec<Client<'a>>,
    },
    /// A payload broadcasted whenever a new client joins.
    ClientJoined {
        #[serde(borrow)]
        client: Client<'a>,
    },
    /// A payload broadcasted whenever a client leaves.
    ClientLeft {
        #[serde(borrow)]
        client: Client<'a>,
    },
    /// A payload broadcasted to the service when a new client subscribes
    /// to the service.
    ///
    /// ### Notes
    /// Only clients that are subscribed to the service will receive
    /// this payload. The owner must also be subscribed to receive this payload.
    ServiceClientSubscribed {
        #[serde(borrow)]
        client: Client<'a>,
        #[serde(borrow)]
        service: Service<'a>,
    },
    /// A payload broadcasted to the service when a client unsubscribes
    /// from the service.
    ///
    /// ### Notes
    /// Only clients that are subscribed to the service will receive
    /// this payload. The owner must also be subscribed to receive this payload.
    ServiceClientUnsubscribed {
        #[serde(borrow)]
        client: Client<'a>,
        #[serde(borrow)]
        service: Service<'a>,
    },
    /// Internal error payload.
    ErrorInternal { desc: &'a str },
    /// Indicates that the "type" of the incoming payload is not supported.
    ErrorUnsupported,
    /// Indicates that the concierge has failed to decode the payload
    /// due to some reason (as reported by `serde`).
    ErrorProtocol { desc: &'a str },
    /// Indicates that no such name exists in the namespace of the conciergee.
    InvalidName { name: &'a str },
    /// Indicates that the Uuid is unrecognized by the concierge.
    InvalidUuid { uuid: Uuid },
    /// Indicates that the service name is not registered with the concierge.
    InvalidService { service: ServiceId<'a> },
}

impl<'a> PayloadOut<'a> {
    pub const fn seq(self, seq: usize) -> SequencedPayloadOut<'a> {
        SequencedPayloadOut { seq, payload: self }
    }

    pub const fn self_subscribe_result(successful: bool, service: Service<'_>) -> PayloadOut {
        PayloadOut::SelfSubscribeResult {
            successful,
            service,
        }
    }

    pub const fn self_unsubscribe_result(successful: bool, service: Service<'_>) -> PayloadOut {
        PayloadOut::SelfUnsubscribeResult {
            successful,
            service,
        }
    }

    pub const fn service_create_result(successful: bool, service: Service<'_>) -> PayloadOut {
        PayloadOut::ServiceCreateResult {
            successful,
            service,
        }
    }

    pub const fn service_delete_result(service: Service<'_>) -> PayloadOut {
        PayloadOut::ServiceDeleteResult { service }
    }

    pub const fn service_client_subscribed<'b>(
        client: Client<'b>,
        service: Service<'b>,
    ) -> PayloadOut<'b> {
        PayloadOut::ServiceClientSubscribed { client, service }
    }

    pub const fn service_client_unsubscribed<'b>(
        client: Client<'b>,
        service: Service<'b>,
    ) -> PayloadOut<'b> {
        PayloadOut::ServiceClientUnsubscribed { client, service }
    }

    pub const fn error_internal(desc: &str) -> PayloadOut {
        PayloadOut::ErrorInternal { desc }
    }

    pub const fn error_protocol(desc: &str) -> PayloadOut {
        PayloadOut::ErrorProtocol { desc }
    }

    pub const fn invalid_name(name: &str) -> PayloadOut {
        PayloadOut::InvalidName { name }
    }

    pub const fn invalid_uuid(uuid: Uuid) -> PayloadOut<'static> {
        PayloadOut::InvalidUuid { uuid }
    }

    pub const fn invalid_group(service: &str) -> PayloadOut {
        PayloadOut::InvalidService { service }
    }
}

/// In general, payloads from the server will usually be sequenced if they
/// are in response to a payload from the client. This may not always be
/// applicable since payloads are sometimes sent automatically and not in
/// response to an input from the socket.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SequencedPayloadOut<'a> {
    /// Sequence number.
    seq: usize,
    /// The actual payload object.
    #[serde(flatten, borrow)]
    payload: PayloadOut<'a>,
}
