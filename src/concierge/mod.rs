mod client;
mod service;

use actix::prelude::*;
use actix_web_actors::ws::Message as WsMessage;
use client::Client;
use concierge_api_rs::{PayloadIn, PayloadMessage, PayloadOut, Target};
use log::{debug, info, trace};
use serde::Serialize;
use service::Service;
use std::collections::{HashMap, HashSet};
use uuid::Uuid;

/// Messages sent to the socket connection.
#[derive(Debug)]
pub struct OutgoingMessage(pub WsMessage);
impl Message for OutgoingMessage {
    type Result = ();
}

/// Identifying information sent from the socket connection.
#[derive(Debug)]
pub struct IdentifyPackage {
    pub name: String,
    pub nickname: Option<String>,
    pub tags: Vec<String>,
    pub addr: Recipient<OutgoingMessage>,
}
impl Message for IdentifyPackage {
    /// * `Some(_)` represents a randomly assigned uuid from the server.
    /// * `None` represents server rejection (hence no uuid assigned).
    type Result = Option<Uuid>;
}

/// Client command to the server to disconnect it.
#[derive(Debug)]
pub struct Disconnect {
    pub uuid: Uuid,
}
impl Message for Disconnect {
    type Result = ();
}

/// String messages sent from the socket connection.
#[derive(Debug)]
pub struct IncomingMessage {
    pub uuid: Uuid,
    pub text: String,
}
impl Message for IncomingMessage {
    type Result = ();
}

/// Query for a client name with the associated UUID.
/// Often used by file routes.
pub struct QueryUuid {
    pub uuid: Uuid,
}
impl Message for QueryUuid {
    type Result = Option<String>;
}

/// Central struct that stores the concierge data.
pub struct Concierge {
    /// Services registered with the concierge.
    pub services: HashMap<String, Service>,
    /// This is the namespace of clients connected to the concierge.
    pub namespace: HashMap<String, Uuid>,
    /// This is the mapping between UUID and Clients.
    /// Statistically, the 128-bit UUIDs generated will not collide.
    pub clients: HashMap<Uuid, Client>,
}

impl Actor for Concierge {
    /// Using a simple Context, since we just need the ability
    /// to communicate with other actors.
    type Context = Context<Self>;
}

impl Concierge {
    /// Create a new concierge.
    pub fn new() -> Self {
        Concierge {
            services: HashMap::default(),
            namespace: HashMap::default(),
            clients: HashMap::default(),
        }
    }

    /// Send a serialized payload message to all clients.
    fn broadcast(&self, payload: &impl Serialize) {
        let string = serde_json::to_string(payload).expect("Serialization error");
        self.broadcast_string(&string)
    }

    /// Send a message to all clients.
    fn broadcast_string(&self, string: &str) {
        for client in self.clients.values() {
            let _ = client
                .addr
                .do_send(OutgoingMessage(WsMessage::Text(string.to_string())));
        }
    }

    /// Handle message payloads.
    fn handle_message<'a>(
        &self,
        client_uuid: Uuid,
        seq: usize,
        payload: PayloadMessage<'a, &'a serde_json::value::RawValue>,
    ) {
        let client = self.clients.get(&client_uuid).unwrap();
        let client_origin = client.info().to_origin();
        match payload.target {
            Target::Name { name } => {
                // Obtain the UUID from the namespace and send the payload.
                if let Some(target_client) = self
                    .namespace
                    .get(name)
                    .and_then(|id| self.clients.get(&id))
                {
                    target_client.send(&payload.with_origin(client_origin));
                    client.send(&PayloadOut::Ok.seq(seq))
                } else {
                    client.send(&PayloadOut::invalid_name(name).seq(seq))
                }
            }
            Target::Uuid { uuid } => {
                // Send the payload.
                if let Some(target_client) = self.clients.get(&uuid) {
                    target_client.send(&payload.with_origin(client_origin));
                    client.send(&PayloadOut::Ok.seq(seq))
                } else {
                    client.send(&PayloadOut::invalid_uuid(uuid).seq(seq))
                }
            }
            Target::Service {
                service: service_name,
            } => {
                // Find the service.
                if let Some(service) = self.services.get(service_name) {
                    let origin = client_origin.with_service(service.info());
                    if client_uuid == service.owner_uuid {
                        // Owners are allowed to broadcast to the service.
                        // They will not get an echo of their own message.
                        service.broadcast(&self.clients, &payload.with_origin(origin), false);
                        client.send(&PayloadOut::Ok.seq(seq))
                    } else if !service.subscribers.contains(&client_uuid) {
                        // Client must be subscribed in order to send messages to the owner.
                        client.send(&PayloadOut::Bad.seq(seq))
                    } else if let Some(owner_client) = self.clients.get(&service.owner_uuid) {
                        // Other clients sending to the service will only send to the owner.
                        owner_client.send(&payload.with_origin(origin));
                        client.send(&PayloadOut::Ok.seq(seq))
                    } else {
                        client.send(
                            &PayloadOut::error_internal("Group owner does not exist").seq(seq),
                        )
                    }
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq))
                }
            }
            Target::ServiceClientUuid {
                service: service_name,
                uuid: target_client_uuid,
            } => {
                // Find the service.
                if let Some(service) = self.services.get(service_name) {
                    // Only owners of a service are allowed to use this target.
                    if client_uuid != service.owner_uuid {
                        client.send(&PayloadOut::Bad.seq(seq))
                    } else if let Some(target_client) = self.clients.get(&target_client_uuid) {
                        let origin = client_origin.with_service(service.info());
                        target_client.send(&payload.with_origin(origin));
                        client.send(&PayloadOut::Ok.seq(seq))
                    } else {
                        client.send(&PayloadOut::invalid_uuid(target_client_uuid).seq(seq))
                    }
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq))
                }
            }
            Target::All => {
                // Broadcast to all clients.
                self.broadcast(&payload.with_origin(client_origin));
                client.send(&PayloadOut::Ok.seq(seq))
            }
        }
    }

    /// Handles incoming JSON payloads.
    fn handle_payload(&mut self, client_uuid: Uuid, payload: PayloadIn<'_>) {
        let seq = self.clients.get(&client_uuid).unwrap().seq;
        match payload {
            PayloadIn::SelfSubscribe {
                service: service_name,
            } => {
                let client = self.clients.get_mut(&client_uuid).unwrap();

                if let Some((service_info, successful)) =
                    client.subscribe(&mut self.services, service_name)
                {
                    // Clients know they are subscribed before others.
                    client.send(
                        &PayloadOut::self_subscribe_result(successful, service_info).seq(seq),
                    );
                    if successful {
                        // Notify others.
                        let client_info = client.info().owned();
                        let service = self.services.get(service_name).unwrap();
                        service.broadcast(
                            &self.clients,
                            &PayloadOut::service_client_subscribed(client_info, service.info()),
                            true,
                        );
                    }
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq));
                }
            }
            PayloadIn::SelfUnsubscribe {
                service: service_name,
            } => {
                let client = self.clients.get_mut(&client_uuid).unwrap();

                if let Some((service_info, successful)) =
                    client.unsubscribe(&mut self.services, service_name)
                {
                    // Clients know they are unsubscribed before others.
                    client.send(
                        &PayloadOut::self_unsubscribe_result(successful, service_info).seq(seq),
                    );
                    if successful {
                        // Notify others.
                        let client_info = client.info().owned();
                        let service = self.services.get(service_name).unwrap();
                        service.broadcast(
                            &self.clients,
                            &PayloadOut::service_client_unsubscribed(client_info, service.info()),
                            true,
                        )
                    }
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq));
                }
            }
            PayloadIn::SelfSetSeq { seq } => {
                // Set the client's sequence number.
                let client = self.clients.get_mut(&client_uuid).unwrap();
                client.seq = seq;
                client.send(&PayloadOut::Ok.seq(client.seq));
            }
            PayloadIn::ServiceCreate {
                service: service_name,
                nickname,
            } => {
                let client = self.clients.get(&client_uuid).unwrap();
                let (service_info, successful) =
                    client.try_create_service(&mut self.services, service_name, nickname);

                let created_result = PayloadOut::service_create_result(successful, service_info);

                // Only broadcast service creation if successful. Client sees it also but
                // it does not have a sequence number attached.
                if successful {
                    self.broadcast(&created_result);
                }

                // Client gets to know the result.
                client.send(&created_result.seq(seq));
            }
            PayloadIn::ServiceDelete {
                service: service_name,
            } => {
                let client = self.clients.get(&client_uuid).unwrap();
                if let Some(result) = client.try_remove_service(&mut self.services, service_name) {
                    match result {
                        Ok(service) => {
                            // Broadcast successful deletion.
                            let delete_result = PayloadOut::service_delete_result(service.info());
                            self.broadcast(&delete_result);
                            client.send(&delete_result.seq(seq));
                        }
                        Err(_) => {
                            client.send(&PayloadOut::Bad);
                        }
                    }
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq));
                }
            }
            PayloadIn::ServiceFetch {
                service: service_name,
            } => {
                let client = self.clients.get(&client_uuid).unwrap();
                // Get and respond with service info.
                if let Some(service) = self.services.get(service_name) {
                    client.send(
                        &PayloadOut::ServiceFetchResult {
                            service: service.info(),
                        }
                        .seq(seq),
                    );
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq));
                }
            }
            PayloadIn::ClientFetchAll => {
                // Respond with all client info.
                let client = self.clients.get(&client_uuid).unwrap();
                let clients = self.clients.values().map(Client::info).collect::<Vec<_>>();
                client.send(&PayloadOut::ClientFetchAllResult { clients }.seq(seq));
            }
            PayloadIn::ServiceFetchAll => {
                // Respond with all service info.
                let client = self.clients.get(&client_uuid).unwrap();
                let service_infos = self.services.values().map(Service::info).collect();
                client.send(
                    &PayloadOut::ServiceFetchAllResult {
                        services: service_infos,
                    }
                    .seq(seq),
                );
            }
            PayloadIn::SelfFetch => {
                // Respond with self information.
                let client = self.clients.get(&client_uuid).unwrap();
                let service_infos = client
                    .subscriptions
                    .iter()
                    .filter_map(|id| self.services.get(id))
                    .map(Service::info)
                    .collect::<Vec<_>>();
                client.send(
                    &PayloadOut::SelfFetchResult {
                        client: client.info(),
                        subscriptions: service_infos,
                    }
                    .seq(seq),
                )
            }
            PayloadIn::ClientFetch { uuid: target_uuid } => {
                // Respond with client information.
                let client = self.clients.get(&client_uuid).unwrap();
                if let Some(target_client) = self.clients.get(&target_uuid) {
                    let service_infos = target_client
                        .subscriptions
                        .iter()
                        .filter_map(|id| self.services.get(id))
                        .map(Service::info)
                        .collect::<Vec<_>>();
                    client.send(
                        &PayloadOut::ClientFetchResult {
                            client: target_client.info(),
                            subscriptions: service_infos,
                        }
                        .seq(seq),
                    )
                }
            }
            _ => {
                let client = self.clients.get(&client_uuid).unwrap();
                client.send(&PayloadOut::ErrorUnsupported.seq(seq))
            }
        }
    }
}

impl Handler<IdentifyPackage> for Concierge {
    type Result = MessageResult<IdentifyPackage>;

    fn handle(&mut self, msg: IdentifyPackage, _: &mut Context<Self>) -> Self::Result {
        info!("Client identified. Payload: {:#?}", msg);

        // Reject if duplicate name.
        if self.namespace.contains_key(&msg.name) {
            return MessageResult(None);
        }

        // Generate UUID and insert to namespace.
        let uuid = Uuid::new_v4();
        self.namespace.insert(msg.name.clone(), uuid);

        let client = Client {
            uuid,
            name: msg.name,
            nickname: msg.nickname,
            seq: 0,
            tags: msg.tags,
            addr: msg.addr,
            subscriptions: HashSet::default(),
        };

        // Broadcast client join to everyone.
        self.broadcast(&PayloadOut::ClientJoined {
            client: client.info(),
        });

        // Send the hello payload.
        client.send(&PayloadOut::Hello {
            uuid,
            version: crate::VERSION,
        });

        self.clients.insert(uuid, client);

        debug!("Client (uuid: {}) registered.", uuid);
        MessageResult(Some(uuid))
    }
}

impl Handler<Disconnect> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        debug!("Received disconnect command (uuid: {}).", msg.uuid);
        if let Some(client) = self.clients.remove(&msg.uuid) {
            info!("Client (uuid: {}) disconnected.", msg.uuid);

            self.namespace.remove(&client.name);

            // Remove all services owned by this client.
            let removing_services = self
                .services
                .iter()
                .filter(|(_, group)| group.owner_uuid == client.uuid)
                .map(|(name, _)| name)
                .cloned()
                .collect::<Vec<_>>();
            for service_name in removing_services {
                // Safety: The service must exist since we have a write lock,
                // and we just queried it's existence.
                let service = self.services.remove(&service_name).unwrap();
                self.broadcast(&PayloadOut::ServiceDeleteResult {
                    service: service.info(),
                });
            }

            // Remove the client from all services
            for service in self.services.values_mut() {
                service.broadcast(
                    &self.clients,
                    &PayloadOut::ServiceClientUnsubscribed {
                        client: client.info(),
                        service: service.info(),
                    },
                    true,
                );
                service.remove_subscriber(client.uuid);
            }

            let _ = std::fs::remove_dir_all(crate::fs::base_path(&client.name));

            // Broadcast client leave to all connecting clients.
            self.broadcast(&PayloadOut::ClientLeft {
                client: client.info(),
            });
        }
    }
}

impl Handler<IncomingMessage> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: IncomingMessage, _: &mut Context<Self>) {
        let IncomingMessage { uuid, text } = msg;
        trace!("Client (uuid: {}) sent message: {}", uuid, text);

        let seq = self.clients.get(&uuid).unwrap().seq;

        // Prioritize trying to parse messages (since they are the primary form of function).
        if let Ok(payload) = serde_json::from_str(&text) {
            self.handle_message(uuid, seq, payload);
        } else {
            // Parse other payloads.
            match serde_json::from_str(&text) {
                Ok(payload) => {
                    self.handle_payload(uuid, payload);
                }
                Err(err) => {
                    self.clients
                        .get(&uuid)
                        .unwrap()
                        .send(&PayloadOut::error_protocol(&err.to_string()).seq(seq));
                }
            }
        }

        self.clients.get_mut(&uuid).unwrap().seq += 1;
    }
}

impl Handler<QueryUuid> for Concierge {
    type Result = Option<String>;

    fn handle(&mut self, msg: QueryUuid, _: &mut Context<Self>) -> Self::Result {
        trace!("Concierge queried (uuid: {}).", msg.uuid);
        self.clients.get(&msg.uuid).map(|c| c.name.to_string())
    }
}
