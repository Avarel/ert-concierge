//! `ChatServer` is an actor. It maintains list of connection client session.
//! And manages available rooms. Peers send messages to other peers in same
//! room through `ChatServer`.

mod client;
mod service;

use actix::prelude::*;
use client::Client;
use concierge_api_rs::{PayloadIn, PayloadMessage, PayloadOut, Target};
use serde::Serialize;
use service::Service;
use std::{cell::RefCell, collections::HashMap};
use uuid::Uuid;

/// Chat server sends this messages to session
pub struct OutgoingMessage(pub String);
impl Message for OutgoingMessage {
    type Result = ();
}

/// Message for chat server communications

/// New chat session is created
pub struct IdentifyPackage {
    pub name: String,
    pub nickname: Option<String>,
    pub tags: Vec<String>,
    pub addr: Recipient<OutgoingMessage>,
}
impl Message for IdentifyPackage {
    type Result = Uuid;
}

/// Session is disconnected
pub struct Disconnect {
    pub uuid: Uuid,
}
impl Message for Disconnect {
    type Result = ();
}

/// Send message to specific room
pub struct IncomingMessage {
    /// Id of the client session
    pub uuid: Uuid,
    /// Peer message
    pub text: String,
}
impl Message for IncomingMessage {
    type Result = ();
}

/// `ChatServer` manages chat rooms and responsible for coordinating chat
/// session. implementation is super primitive
pub struct Concierge {
    /// This is the groups registered in the Concierge.
    pub services: RefCell<HashMap<String, Service>>,
    /// This is the namespace of the Concierge.
    /// It uses an RwLock in order to prevent race conditions.
    pub namespace: RefCell<HashMap<String, Uuid>>,
    /// This is the mapping between UUID and Clients. There
    /// is no lock since UUID statistically will not collide.
    pub clients: RefCell<HashMap<Uuid, Client>>,
}

impl Concierge {
    pub fn new() -> Self {
        Concierge {
            services: RefCell::default(),
            namespace: RefCell::default(),
            clients: RefCell::default(),
        }
    }

    /// Send message to all users in the room
    fn broadcast(&self, payload: &impl Serialize) {
        let string = serde_json::to_string(payload).expect("Serialization error");
        for client in self.clients.borrow().values() {
            let _ = client.addr.do_send(OutgoingMessage(string.to_owned()));
        }
    }

    fn handle_raw_message<'a>(
        &self,
        client_uuid: Uuid,
        seq: usize,
        payload: PayloadMessage<'a, &'a serde_json::value::RawValue>,
    ) {
        let clients = self.clients.borrow();
        let client = clients.get(&client_uuid).unwrap();
        let client_info = client.info();
        match payload.target {
            Target::Name { name } => {
                if let Some(target_client) = self
                    .namespace
                    .borrow()
                    .get(name)
                    .and_then(|id| clients.get(&id))
                {
                    target_client.send(&payload.with_origin(client_info.to_origin()));
                    client.send(&PayloadOut::Ok.seq(seq))
                } else {
                    client.send(&PayloadOut::invalid_name(name).seq(seq))
                }
            }
            Target::Uuid { uuid } => {
                if let Some(target_client) = clients.get(&uuid) {
                    target_client.send(&payload.with_origin(client_info.to_origin()));
                    client.send(&PayloadOut::Ok.seq(seq))
                } else {
                    client.send(&PayloadOut::invalid_uuid(uuid).seq(seq))
                }
            }
            Target::Service {
                service: service_name,
            } => {
                if let Some(service) = self.services.borrow().get(service_name) {
                    let origin = client_info.to_origin().with_service(service.info());
                    if client_uuid == service.owner_uuid {
                        // Owners are allowed to broadcast to the service.
                        // They will not get an echo of their own message.
                        service
                            .hook(&self)
                            .broadcast(&payload.with_origin(origin), false);
                        client.send(&PayloadOut::Ok.seq(seq))
                    } else if !service.clients.contains(&client_uuid) {
                        // Client must be subscribed in order to send messages to the owner.
                        client.send(&PayloadOut::Bad.seq(seq))
                    } else if let Some(owner_client) = clients.get(&service.owner_uuid) {
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
                if let Some(service) = self.services.borrow().get(service_name) {
                    // Only owners of a service are allowed to use this target.
                    if client_uuid != service.owner_uuid {
                        client.send(&PayloadOut::Bad.seq(seq))
                    } else if let Some(target_client) = clients.get(&target_client_uuid) {
                        let origin = client_info.to_origin().with_service(service.info());
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
                self.broadcast(&payload.with_origin(client_info.to_origin()));
                client.send(&PayloadOut::Ok.seq(seq))
            }
        }
    }

    /// Handles incoming JSON payloads.
    fn handle_payload(&mut self, client_uuid: Uuid, seq: usize, payload: PayloadIn<'_>) {
        let clients = self.clients.borrow();
        let client = clients.get(&client_uuid).unwrap();
        match payload {
            PayloadIn::SelfSubscribe {
                service: service_name,
            } => {
                if let Some((service_info, successful)) = client.hook(&self).subscribe(service_name)
                {
                    if successful {
                        let services = self.services.borrow_mut();
                        let service = services.get(service_name).unwrap();
                        service.hook(&self).broadcast(
                            &PayloadOut::service_client_subscribed(client.info(), service.info()),
                            true,
                        );
                        drop(services);
                    }
                    client.send(
                        &PayloadOut::self_subscribe_result(successful, service_info).seq(seq),
                    );
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq));
                }
            }
            PayloadIn::SelfUnsubscribe {
                service: service_name,
            } => {
                if let Some((service_info, successful)) =
                    client.hook(&self).unsubscribe(service_name)
                {
                    if successful {
                        let services = self.services.borrow();
                        let service = services.get(service_name).unwrap();
                        service.hook(&self).broadcast(
                            &PayloadOut::service_client_unsubscribed(client.info(), service.info()),
                            true,
                        );
                        drop(services);
                    }
                    client.send(
                        &PayloadOut::self_unsubscribe_result(successful, service_info).seq(seq),
                    );
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq));
                }
            }
            PayloadIn::SelfSetSeq { seq } => {
                drop(client);
                drop(clients);
                let client = self.clients.get_mut().get_mut(&client_uuid).unwrap();
                client.seq = seq;
            }
            PayloadIn::ServiceCreate {
                service: service_name,
                nickname,
            } => {
                let controller = client.hook(&self);
                let (service_info, successful) =
                    controller.try_create_service(service_name, nickname);

                let created_result = PayloadOut::service_create_result(successful, service_info);

                if successful {
                    self.broadcast(&created_result);
                }

                client.send(&created_result.seq(seq));
            }
            PayloadIn::ServiceDelete {
                service: service_name,
            } => {
                if let Some(result) = client.hook(&self).try_remove_service(service_name) {
                    match result {
                        Ok(service) => {
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
                if let Some(service) = self.services.borrow().get(service_name) {
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
                let clients = clients.values().map(Client::info).collect::<Vec<_>>();
                client.send(&PayloadOut::ClientFetchAllResult { clients }.seq(seq));
            }
            PayloadIn::ServiceFetchAll => {
                let services = self.services.borrow();
                let service_infos = services.values().map(Service::info).collect();
                client.send(
                    &PayloadOut::ServiceFetchAllResult {
                        services: service_infos,
                    }
                    .seq(seq),
                );
            }
            PayloadIn::SelfFetch => {
                let subscriptions = client.subscriptions.borrow();
                let services = self.services.borrow();
                let service_infos = subscriptions
                    .iter()
                    .filter_map(|id| services.get(id))
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
            _ => client.send(&PayloadOut::ErrorUnsupported.seq(seq)),
        }
    }
}

/// Make actor from `ChatServer`
impl Actor for Concierge {
    /// We are going to use simple Context, we just need ability to communicate
    /// with other actors.
    type Context = Context<Self>;
}

/// Handler for Connect message.
///
/// Register new session and assign unique id to this session
impl Handler<IdentifyPackage> for Concierge {
    type Result = MessageResult<IdentifyPackage>;

    fn handle(&mut self, msg: IdentifyPackage, _: &mut Context<Self>) -> Self::Result {
        println!("Someone joined");

        // register session with random id
        let uuid = Uuid::new_v4();
        let client = Client {
            uuid,
            name: msg.name,
            nickname: msg.nickname,
            seq: 0,
            tags: msg.tags,
            addr: msg.addr,
            subscriptions: RefCell::default(),
        };

        self.broadcast(&PayloadOut::ClientJoined {
            client: client.info(),
        });

        client.send(&PayloadOut::Hello {
            uuid,
            version: crate::VERSION,
        });

        self.clients.get_mut().insert(uuid, client);

        // send id back
        MessageResult(uuid)
    }
}

/// Handler for Disconnect message.
impl Handler<Disconnect> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        println!("Someone disconnected");

        if let Some(client) = self.clients.get_mut().remove(&msg.uuid) {
            self.namespace.get_mut().remove(&client.name);
            // TODO: do a bunch of other stuff
        }
    }
}

/// Handler for Message message.
impl Handler<IncomingMessage> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: IncomingMessage, _: &mut Context<Self>) {
        let IncomingMessage { uuid, text } = msg;

        let seq = self.clients.get_mut().get(&uuid).unwrap().seq;

        if let Ok(payload) = serde_json::from_str(&text) {
            self.handle_raw_message(uuid, seq, payload);
        } else {
            match serde_json::from_str::<PayloadIn>(&text) {
                Ok(payload) => {
                    self.handle_payload(uuid, seq, payload);
                }
                Err(err) => {
                    self.clients
                        .borrow()
                        .get(&uuid)
                        .unwrap()
                        .send(&PayloadOut::error_protocol(&err.to_string()).seq(seq));
                }
            }
        }

        self.clients.get_mut().get_mut(&uuid).unwrap().seq += 1;
    }
}
