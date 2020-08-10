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
use std::collections::{HashMap, HashSet};
use uuid::Uuid;

/// Chat server sends this messages to session
pub struct OutgoingMessage(pub String);
impl Message for OutgoingMessage {
    type Result = ();
}

/// Message for chat server communications

/// New chat session is created
pub struct Identify {
    pub name: String,
    pub nickname: Option<String>,
    pub version: String,
    pub tags: Vec<String>,
    pub addr: Recipient<OutgoingMessage>,
}
impl Message for Identify {
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
    pub services: HashMap<String, Service>,
    /// This is the namespace of the Concierge.
    /// It uses an RwLock in order to prevent race conditions.
    pub namespace: HashMap<String, Uuid>,
    /// This is the mapping between UUID and Clients. There
    /// is no lock since UUID statistically will not collide.
    pub clients: HashMap<Uuid, Client>,
}

impl Concierge {
    pub fn new() -> Self {
        Concierge {
            services: HashMap::new(),
            namespace: HashMap::new(),
            clients: HashMap::new(),
        }
    }

    /// Send message to all users in the room
    fn broadcast_all(&self, payload: &impl Serialize) {
        let string = serde_json::to_string(payload).expect("Serialization error");
        for client in self.clients.values() {
            let _ = client.addr.do_send(OutgoingMessage(string.to_owned()));
        }
    }

    fn handle_raw_message<'a>(
        &self,
        client_uuid: Uuid,
        seq: usize,
        payload: PayloadMessage<'a, &'a serde_json::value::RawValue>,
    ) {
        let client = self.clients.get(&client_uuid).unwrap();
        let client_info = client.info();
        match payload.target {
            Target::Name { name } => {
                if let Some(target_client) = self
                    .namespace
                    .get(name)
                    .and_then(|id| self.clients.get(&id))
                {
                    target_client.send(&payload.with_origin(client_info.to_origin()));
                    client.send(&PayloadOut::Ok.seq(seq))
                } else {
                    client.send(&PayloadOut::invalid_name(name).seq(seq))
                }
            }
            Target::Uuid { uuid } => {
                if let Some(target_client) = self.clients.get(&uuid) {
                    target_client.send(&payload.with_origin(client_info.to_origin()));
                    client.send(&PayloadOut::Ok.seq(seq))
                } else {
                    client.send(&PayloadOut::invalid_uuid(uuid).seq(seq))
                }
            }
            _ => {} // Target::Service {
                    //     service: service_name,
                    // } => {
                    //     if let Some(service) = self.concierge.services.read().await.get(service_name) {
                    //         let origin = client_info.to_origin().with_service(service.info());
                    //         if client_uuid == service.owner_uuid {
                    //             // Owners are allowed to broadcast to the service.
                    //             // They will not get an echo of their own message.
                    //             service
                    //                 .hook(&self.concierge)
                    //                 .broadcast(&payload.with_origin(origin), false)
                    //                 .await?;
                    //             client.send(&PayloadOut::Ok.seq(seq))
                    //         } else if !service.clients.contains(&client_uuid) {
                    //             // Client must be subscribed in order to send messages to the owner.
                    //             client.send(&PayloadOut::Bad.seq(seq))
                    //         } else if let Some(owner_client) = clients.get(&service.owner_uuid) {
                    //             // Other clients sending to the service will only send to the owner.
                    //             owner_client.send(&payload.with_origin(origin))?;
                    //             client.send(&PayloadOut::Ok.seq(seq))
                    //         } else {
                    //             client.send(
                    //                 &PayloadOut::error_internal("Group owner does not exist").seq(seq),
                    //             )
                    //         }
                    //     } else {
                    //         client.send(&PayloadOut::invalid_group(service_name).seq(seq))
                    //     }
                    // }
                    // Target::ServiceClientUuid {
                    //     service: service_name,
                    //     uuid: target_client_uuid,
                    // } => {
                    //     if let Some(service) = self.concierge.services.read().await.get(service_name) {
                    //         // Only owners of a service are allowed to use this target.
                    //         if client_uuid != service.owner_uuid {
                    //             client.send(&PayloadOut::Bad.seq(seq))
                    //         } else if let Some(target_client) = clients.get(&target_client_uuid) {
                    //             let origin = client_info.to_origin().with_service(service.info());
                    //             target_client.send(&payload.with_origin(origin))?;
                    //             client.send(&PayloadOut::Ok.seq(seq))
                    //         } else {
                    //             client.send(&PayloadOut::invalid_uuid(target_client_uuid).seq(seq))
                    //         }
                    //     } else {
                    //         client.send(&PayloadOut::invalid_group(service_name).seq(seq))
                    //     }
                    // }
                    // Target::All => {
                    //     self.concierge
                    //         .broadcast(&payload.with_origin(client_info.to_origin()))
                    //         .await?;
                    //     client.send(&PayloadOut::Ok.seq(seq))
                    // }
        }
    }

    fn broadcast_to_clients<'a>(clients: impl IntoIterator<Item=&'a Client>, payload: &impl Serialize) {
        let message = serde_json::to_string(payload).expect("Serialization error");
        for client in clients {
            client.send_ws_msg(message.clone());
        }
    }

    /// Handles incoming JSON payloads.
    fn handle_payload(&mut self, client_uuid: Uuid, seq: usize, payload: PayloadIn<'_>) {
        match payload {
            PayloadIn::SelfSubscribe {
                service: service_name,
            } => {
                if let Some(service) = self.services.get_mut(service_name) {
                    let successful = service.add_subscriber(client_uuid);

                    let client = self.clients.get_mut(&client_uuid).unwrap();
                    client.subscriptions.insert(service.name.to_string());

                    if successful {
                        let client_info = client.info().owned();
                        let service_info = service.info().owned();
                        Self::broadcast_to_clients(self.clients.values(), &PayloadOut::Ok);
                        // self.broadcast_to_service(
                        //     service,
                        //     &PayloadOut::service_client_subscribed(client.info(), service.info()),
                        // );
                    }
                } else {
                }
            }
            _ => {}
        }
        //     match payload {
        //         PayloadIn::SelfSubscribe {
        //             service: service_name,
        //         } => {
        //             if let Some((service_info, successful)) =
        //                 client.hook(&self.concierge).subscribe(service_name).await
        //             {
        //                 if successful {
        //                     let services = self.concierge.services.read().await;
        //                     let service = services.get(service_name).unwrap();
        //                     service
        //                         .hook(&self.concierge)
        //                         .broadcast(
        //                             &PayloadOut::service_client_subscribed(
        //                                 client.info(),
        //                                 service.info(),
        //                             ),
        //                             true,
        //                         )
        //                         .await?;
        //                     drop(services);
        //                 }
        //                 client.send(
        //                     &PayloadOut::self_subscribe_result(successful, service_info).seq(seq),
        //                 )?;
        //             } else {
        //                 client.send(&PayloadOut::invalid_group(service_name).seq(seq))?;
        //             }
        //         }
        //         PayloadIn::SelfUnsubscribe {
        //             service: service_name,
        //         } => {
        //             if let Some((service_info, successful)) =
        //                 client.hook(&self.concierge).unsubscribe(service_name).await
        //             {
        //                 if successful {
        //                     let services = self.concierge.services.read().await;
        //                     let service = services.get(service_name).unwrap();
        //                     service
        //                         .hook(&self.concierge)
        //                         .broadcast(
        //                             &PayloadOut::service_client_unsubscribed(
        //                                 client.info(),
        //                                 service.info(),
        //                             ),
        //                             true,
        //                         )
        //                         .await?;
        //                     drop(services);
        //                 }
        //                 client.send(
        //                     &PayloadOut::self_unsubscribe_result(successful, service_info).seq(seq),
        //                 )?;
        //             } else {
        //                 client.send(&PayloadOut::invalid_group(service_name).seq(seq))?;
        //             }
        //         }
        //         PayloadIn::SelfSetSeq { seq } => {
        //             *seq_ref = seq;
        //             client.send(&PayloadOut::Ok.seq(*seq_ref))?;
        //         }
        //         PayloadIn::ServiceCreate {
        //             service: service_name,
        //             nickname,
        //         } => {
        //             let controller = client.hook(&self.concierge);
        //             let (service_info, successful) =
        //                 controller.try_create_service(service_name, nickname).await;

        //             let created_result = PayloadOut::service_create_result(successful, service_info);

        //             if successful {
        //                 self.concierge.broadcast(&created_result).await?;
        //             }

        //             client.send(&created_result.seq(seq))?;
        //         }
        //         PayloadIn::ServiceDelete {
        //             service: service_name,
        //         } => {
        //             if let Some(result) = client
        //                 .hook(&self.concierge)
        //                 .try_remove_service(service_name)
        //                 .await
        //             {
        //                 match result {
        //                     Ok(service) => {
        //                         let delete_result = PayloadOut::service_delete_result(service.info());
        //                         self.concierge.broadcast(&delete_result).await?;
        //                         client.send(&delete_result.seq(seq))?;
        //                     }
        //                     Err(_) => {
        //                         client.send(&PayloadOut::Bad)?;
        //                     }
        //                 }
        //             } else {
        //                 client.send(&PayloadOut::invalid_group(service_name).seq(seq))?;
        //             }
        //         }
        //         PayloadIn::ServiceFetch {
        //             service: service_name,
        //         } => {
        //             if let Some(service) = self.concierge.services.read().await.get(service_name) {
        //                 client.send(
        //                     &PayloadOut::ServiceFetchResult {
        //                         service: service.info(),
        //                     }
        //                     .seq(seq),
        //                 )?;
        //             } else {
        //                 client.send(&PayloadOut::invalid_group(service_name).seq(seq))?;
        //             }
        //         }
        //         PayloadIn::ClientFetchAll => {
        //             let clients = clients.values().map(Client::info).collect::<Vec<_>>();
        //             client.send(&PayloadOut::ClientFetchAllResult { clients }.seq(seq))?;
        //         }
        //         PayloadIn::ServiceFetchAll => {
        //             let services = self.concierge.services.read().await;
        //             let service_infos = services.values().map(Service::info).collect();
        //             client.send(
        //                 &PayloadOut::ServiceFetchAllResult {
        //                     services: service_infos,
        //                 }
        //                 .seq(seq),
        //             )?;
        //         }
        //         PayloadIn::SelfFetch => {
        //             let subscriptions = client.subscriptions.read().await;
        //             let services = self.concierge.services.read().await;
        //             let service_infos = subscriptions
        //                 .iter()
        //                 .filter_map(|id| services.get(id))
        //                 .map(Service::info)
        //                 .collect::<Vec<_>>();
        //             client.send(
        //                 &PayloadOut::SelfFetchResult {
        //                     client: client.info(),
        //                     subscriptions: service_infos,
        //                 }
        //                 .seq(seq),
        //             )?
        //         }
        //         _ => client.send(&PayloadOut::ErrorUnsupported.seq(seq))?,
        //     }
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
impl Handler<Identify> for Concierge {
    type Result = MessageResult<Identify>;

    fn handle(&mut self, msg: Identify, _: &mut Context<Self>) -> Self::Result {
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
            subscriptions: HashSet::new(),
        };

        self.broadcast_all(&PayloadOut::ClientJoined {
            client: client.info(),
        });

        self.clients.insert(uuid, client);

        // send id back
        MessageResult(uuid)
    }
}

/// Handler for Disconnect message.
impl Handler<Disconnect> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        println!("Someone disconnected");

        if let Some(client) = self.clients.remove(&msg.uuid) {
            self.namespace.remove(&client.name);
            // TODO: do a bunch of other stuff
        }
    }
}

/// Handler for Message message.
impl Handler<IncomingMessage> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: IncomingMessage, _: &mut Context<Self>) {
        let IncomingMessage { uuid, text } = msg;

        let seq = self.clients.get(&uuid).unwrap().seq;

        if let Ok(payload) = serde_json::from_str(&text) {
            self.handle_raw_message(uuid, seq, payload);
        } else {
            match serde_json::from_str::<PayloadIn>(&text) {
                Ok(payload) => {
                    self.handle_payload(uuid, seq, payload);
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
