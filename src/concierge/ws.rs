//! This file manages the low-level internal implementation of the WebSocket handle.

use super::Concierge;
use super::{client::Client, service::Service};
use concierge_api_rs::{CloseReason, PayloadIn, PayloadMessage, PayloadOut, Target};
pub use error::WsError;
use futures::{future, pin_mut, SinkExt, Stream, StreamExt};
use log::{debug, info, warn};
use semver::Version;
use std::{net::SocketAddr, path::Path, sync::Arc, time::Duration};
use tokio::{sync::mpsc::UnboundedReceiver, time::timeout};
use uuid::Uuid;
use warp::ws::{Message, WebSocket};

mod error {
    #[derive(thiserror::Error, Debug)]
    pub enum WsError {
        #[error("Channel send error")]
        Channel,
        #[error("Serialization error: `{0}`")]
        Json(#[from] serde_json::Error),
        #[error("Conflicting name in namespace")]
        DuplicateName,
        #[error("Socket error: `{0}`")]
        Socket(#[from] warp::Error),
        #[error("Internal error")]
        Internal,
    }
}

fn verify_name(name: &str) -> bool {
    name.chars().all(|c| c.is_alphanumeric() || c == '_')
}

struct IdentifyPackage {
    name: String,
    nickname: Option<String>,
    tags: Vec<String>,
}

pub struct SocketConnection {
    concierge: Arc<Concierge>,
}

impl SocketConnection {
    pub fn new(concierge: Arc<Concierge>) -> Self {
        Self { concierge }
    }

    /// Handle incoming TCP connections and upgrade them to a Websocket connection.
    pub async fn handle_socket_conn(
        self,
        mut socket: WebSocket,
        addr: SocketAddr,
    ) -> Result<(), WsError> {
        // Protocol: Expect a payload that identifies the client within 5 seconds.
        match Self::obtain_id(&mut socket).await {
            // Got the identification data successfully.
            Ok(id) => {
                debug!(
                    "Identification successful. (ip: {}, name: {})",
                    addr, id.name
                );
                let (uuid, rx) = self.make_client(id, &mut socket).await?;
                self.client_loop(uuid, rx, socket).await?;
                Ok(())
            }
            // Failure: send close code to the client and drop the connection.
            Err(close_reason) => {
                warn!(
                    "Client failed to identify. (ip: {}, reason: {})",
                    addr, close_reason.reason
                );
                socket
                    .send(Message::close_with(close_reason.code, close_reason.reason))
                    .await?;
                Ok(socket.close().await?)
            }
        }
    }

    /// Handle the first 5 seconds of identification.
    async fn obtain_id(socket: &mut WebSocket) -> Result<IdentifyPackage, CloseReason<'static>> {
        // Protocol: Expect a payload that identifies the client within 5 seconds.
        if let Ok(Some(Ok(msg))) = timeout(Duration::from_secs(5), socket.next()).await {
            if let Ok(string) = msg.to_str() {
                match serde_json::from_str::<PayloadIn>(string) {
                    Ok(PayloadIn::Identify {
                        name,
                        nickname,
                        version,
                        secret,
                        tags,
                    }) => {
                        // name must be alphanumeric
                        if !verify_name(name) {
                            return Err(CloseReason::BAD_AUTH);
                        }
                        // check for secret
                        if secret != crate::SECRET {
                            return Err(CloseReason::BAD_SECRET);
                        }
                        // check that version matches (might need some work)
                        if !crate::min_version_req().matches(&Version::parse(version).unwrap()) {
                            return Err(CloseReason::BAD_VERSION);
                        }
                        // Convert the tags to owned
                        let tags = tags.iter().map(|s| s.to_string()).collect();

                        Ok(IdentifyPackage {
                            name: name.to_owned(),
                            nickname: nickname.map(ToOwned::to_owned),
                            tags,
                        })
                    }
                    Ok(_) => Err(CloseReason::NO_AUTH),
                    Err(err) => Err(CloseReason::FATAL_DECODE.with_reason(err.to_string())),
                }
            } else {
                Err(CloseReason::FATAL_DECODE)
            }
        } else {
            Err(CloseReason::AUTH_FAILED)
        }
    }

    /// Create a new client.
    async fn make_client(
        &self,
        id: IdentifyPackage,
        socket: &mut WebSocket,
    ) -> Result<(Uuid, UnboundedReceiver<Message>), WsError> {
        // Acquire a write lock to prevent race condition
        let mut namespace = self.concierge.namespace.write().await;
        // Duplicate identification, close the stream.
        if namespace.contains_key(&id.name) {
            warn!(
                "User attempted to join with existing id. (name: {})",
                id.name
            );
            socket
                .send(Message::close_with(
                    CloseReason::DUPLICATE_AUTH.code,
                    CloseReason::DUPLICATE_AUTH.reason,
                ))
                .await?;
            return Err(WsError::DuplicateName);
        }

        // Handle new client
        let client_uuid = Uuid::new_v4();
        // Add to namespace
        namespace.insert(id.name.clone(), client_uuid);
        drop(namespace);
        // Create the client struct
        let mut client = Client::new(client_uuid, id.name, id.nickname, id.tags);
        let rx = client.take_rx().unwrap();

        self.concierge
            .broadcast(&PayloadOut::ClientJoined {
                client: client.info(),
            })
            .await?;

        self.concierge
            .clients
            .write()
            .await
            .insert(client_uuid, client);

        Ok((client_uuid, rx))
    }

    /// Handle new client WebSocket connections.
    async fn client_loop(
        &self,
        client_uuid: Uuid,
        rx: UnboundedReceiver<Message>,
        socket: WebSocket,
    ) -> Result<(), WsError> {
        // This is the WebSocket channels for messages.
        // incoming: where we receive messages
        // outgoing: where the websocket send messages
        let (outgoing, incoming) = socket.split();
        // Have the client handle incoming messages.
        let incoming_loop = self.incoming_loop(client_uuid, incoming);
        // Forward our sent messages (from tx) to the outgoing sink.
        // This is because the client acts upon channels and doesn't know what the websocket is.
        let outgoing_loop = rx.map(Ok).forward(outgoing);

        // Setup complete, send the Hello payload.
        self.concierge
            .clients
            .read()
            .await
            .get(&client_uuid)
            .unwrap()
            .send(&PayloadOut::Hello {
                uuid: client_uuid,
                version: crate::VERSION,
            })?;

        // Irrelevant implementation detail: pinning prevents pointer invalidation
        pin_mut!(incoming_loop, outgoing_loop);
        // Select waits for the first task to complete: in this case, its whether
        // the stream `receive_from_others` end or `broadcast_incoming` end first,
        // which indicates that the client connection is dead.
        future::select(incoming_loop, outgoing_loop).await;

        self.client_cleanup(client_uuid).await
    }

    /// Remove the client from the self.concierge.
    async fn client_cleanup(&self, client_uuid: Uuid) -> Result<(), WsError> {
        // Connection has been destroyed by this stage.
        info!("Client disconnected. (id: {})", client_uuid);

        // Remove from client map.
        let client = self
            .concierge
            .clients
            .write()
            .await
            .remove(&client_uuid)
            .ok_or_else(|| WsError::Internal)?;
        // Remove from namespace.
        self.concierge.namespace.write().await.remove(client.name());

        // Remove all services owned by this client.
        let mut services = self.concierge.services.write().await;
        let removing_services = services
            .iter()
            .filter(|(_, group)| group.owner_uuid == client_uuid)
            .map(|(name, _)| name.to_owned())
            .collect::<Vec<_>>();
        for service_name in removing_services {
            // Safety: The service must exist since we have a write lock,
            // and we just queried it's existence.
            let service = services.remove(&service_name).unwrap();
            self.concierge
                .broadcast(&PayloadOut::ServiceDeleteResult {
                    service: service.info(),
                })
                .await
                .ok();
        }

        // Remove the client from all services
        for service in services.values_mut() {
            service
                .hook(&self.concierge)
                .broadcast(
                    &PayloadOut::ServiceClientUnsubscribed {
                        client: client.info(),
                        service: service.info(),
                    },
                    true,
                )
                .await?;
            service.remove_subscriber(client_uuid);
        }

        drop(services);

        // Broadcast client leave to all connecting clients.
        self.concierge
            .broadcast(&PayloadOut::ClientLeft {
                client: client.info(),
            })
            .await?;

        // Delete clientfile folder if it exists
        let path = Path::new(".").join("fs").join(client.name());
        if tokio::fs::remove_dir_all(&path).await.is_ok() {
            info!("Deleted {}.", path.display());
        }

        Ok(())
    }

    /// Handle incoming payloads with the client information.
    async fn incoming_loop<E>(
        &self,
        uuid: Uuid,
        mut incoming: impl Stream<Item = Result<Message, E>> + Unpin,
    ) -> Result<(), WsError> {
        let mut seq = 0;
        while let Some(Ok(message)) = incoming.next().await {
            if let Ok(string) = message.to_str() {
                // Try to use the more efficient message format first.
                // The raw format does not attempt to deserialize the "data" field,
                // so we save on CPU cycles.
                if let Ok(payload) = serde_json::from_str(string) {
                    if let Err(err) = self.handle_raw_message(uuid, seq, payload).await {
                        let clients = self.concierge.clients.read().await;
                        let client = clients.get(&uuid).unwrap();
                        client
                            .send(&PayloadOut::error_internal(&err.to_string()).seq(seq))
                            .ok();
                    }
                } else {
                    match serde_json::from_str::<PayloadIn>(string) {
                        Ok(payload) => {
                            if let Err(err) = self.handle_payload(uuid, &mut seq, payload).await {
                                let clients = self.concierge.clients.read().await;
                                let client = clients.get(&uuid).unwrap();
                                client
                                    .send(&PayloadOut::error_internal(&err.to_string()).seq(seq))
                                    .ok();
                            }
                        }
                        Err(err) => {
                            let clients = self.concierge.clients.read().await;
                            let client = clients.get(&uuid).unwrap();
                            client
                                .send(&PayloadOut::error_protocol(&err.to_string()).seq(seq))
                                .ok();
                        }
                    }
                }
                seq += 1;
            }
        }

        Ok(())
    }

    /// Handles incoming JSON payloads.
    async fn handle_payload(
        &self,
        client_uuid: Uuid,
        seq_ref: &mut usize,
        payload: PayloadIn<'_>,
    ) -> Result<(), WsError> {
        let seq = *seq_ref;
        let clients = self.concierge.clients.read().await;
        let client = clients.get(&client_uuid).unwrap();

        match payload {
            PayloadIn::SelfSubscribe {
                service: service_name,
            } => {
                if let Some((service_info, successful)) =
                    client.hook(&self.concierge).subscribe(service_name).await
                {
                    if successful {
                        let services = self.concierge.services.read().await;
                        let service = services.get(service_name).unwrap();
                        service
                            .hook(&self.concierge)
                            .broadcast(
                                &PayloadOut::service_client_subscribed(
                                    client.info(),
                                    service.info(),
                                ),
                                true,
                            )
                            .await?;
                        drop(services);
                    }
                    client.send(
                        &PayloadOut::self_subscribe_result(successful, service_info).seq(seq),
                    )?;
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq))?;
                }
            }
            PayloadIn::SelfUnsubscribe {
                service: service_name,
            } => {
                if let Some((service_info, successful)) =
                    client.hook(&self.concierge).unsubscribe(service_name).await
                {
                    if successful {
                        let services = self.concierge.services.read().await;
                        let service = services.get(service_name).unwrap();
                        service
                            .hook(&self.concierge)
                            .broadcast(
                                &PayloadOut::service_client_unsubscribed(
                                    client.info(),
                                    service.info(),
                                ),
                                true,
                            )
                            .await?;
                        drop(services);
                    }
                    client.send(
                        &PayloadOut::self_unsubscribe_result(successful, service_info).seq(seq),
                    )?;
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq))?;
                }
            }
            PayloadIn::SelfSetSeq { seq } => {
                *seq_ref = seq;
                client.send(&PayloadOut::Ok.seq(*seq_ref))?;
            }
            PayloadIn::ServiceCreate {
                service: service_name,
                nickname,
            } => {
                let controller = client.hook(&self.concierge);
                let (service_info, successful) =
                    controller.try_create_service(service_name, nickname).await;

                let created_result = PayloadOut::service_create_result(successful, service_info);

                if successful {
                    self.concierge.broadcast(&created_result).await?;
                }

                client.send(&created_result.seq(seq))?;
            }
            PayloadIn::ServiceDelete {
                service: service_name,
            } => {
                if let Some(result) = client
                    .hook(&self.concierge)
                    .try_remove_service(service_name)
                    .await
                {
                    match result {
                        Ok(service) => {
                            let delete_result = PayloadOut::service_delete_result(service.info());
                            self.concierge.broadcast(&delete_result).await?;
                            client.send(&delete_result.seq(seq))?;
                        }
                        Err(_) => {
                            client.send(&PayloadOut::Bad)?;
                        }
                    }
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq))?;
                }
            }
            PayloadIn::ServiceFetch {
                service: service_name,
            } => {
                if let Some(service) = self.concierge.services.read().await.get(service_name) {
                    client.send(
                        &PayloadOut::ServiceFetchResult {
                            service: service.info(),
                        }
                        .seq(seq),
                    )?;
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq))?;
                }
            }
            PayloadIn::ClientFetchAll => {
                let clients = clients.values().map(Client::info).collect::<Vec<_>>();
                client.send(&PayloadOut::ClientFetchAllResult { clients }.seq(seq))?;
            }
            PayloadIn::ServiceFetchAll => {
                let services = self.concierge.services.read().await;
                let service_infos = services.values().map(Service::info).collect();
                client.send(
                    &PayloadOut::ServiceFetchAllResult {
                        services: service_infos,
                    }
                    .seq(seq),
                )?;
            }
            PayloadIn::SelfFetch => {
                let subscriptions = client.subscriptions.read().await;
                let services = self.concierge.services.read().await;
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
                )?
            }
            _ => client.send(&PayloadOut::ErrorUnsupported.seq(seq))?,
        }
        Ok(())
    }

    /// Handles raw message payloads.
    async fn handle_raw_message<'a>(
        &self,
        client_uuid: Uuid,
        seq: usize,
        payload: PayloadMessage<'a, &'a serde_json::value::RawValue>,
    ) -> Result<(), WsError> {
        let clients = self.concierge.clients.read().await;
        let client = clients.get(&client_uuid).unwrap();
        let client_info = client.info();
        match payload.target {
            Target::Name { name } => {
                if let Some(target_client) = self
                    .concierge
                    .namespace
                    .read()
                    .await
                    .get(name)
                    .and_then(|id| clients.get(&id))
                {
                    target_client.send(&payload.with_origin(client_info.to_origin()))?;
                    client.send(&PayloadOut::Ok.seq(seq))
                } else {
                    client.send(&PayloadOut::invalid_name(name).seq(seq))
                }
            }
            Target::Uuid { uuid } => {
                if let Some(target_client) = clients.get(&uuid) {
                    target_client.send(&payload.with_origin(client_info.to_origin()))?;
                    client.send(&PayloadOut::Ok.seq(seq))
                } else {
                    client.send(&PayloadOut::invalid_uuid(uuid).seq(seq))
                }
            }
            Target::Service {
                service: service_name,
            } => {
                if let Some(service) = self.concierge.services.read().await.get(service_name) {
                    let origin = client_info.to_origin().with_service(service.info());
                    if client_uuid == service.owner_uuid {
                        // Owners are allowed to broadcast to the service.
                        // They will not get an echo of their own message.
                        service
                            .hook(&self.concierge)
                            .broadcast(&payload.with_origin(origin), false)
                            .await?;
                        client.send(&PayloadOut::Ok.seq(seq))
                    } else if !service.clients.contains(&client_uuid) {
                        // Client must be subscribed in order to send messages to the owner.
                        client.send(&PayloadOut::Bad.seq(seq))
                    } else if let Some(owner_client) = clients.get(&service.owner_uuid) {
                        // Other clients sending to the service will only send to the owner.
                        owner_client.send(&payload.with_origin(origin))?;
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
                if let Some(service) = self.concierge.services.read().await.get(service_name) {
                    // Only owners of a service are allowed to use this target.
                    if client_uuid != service.owner_uuid {
                        client.send(&PayloadOut::Bad.seq(seq))
                    } else if let Some(target_client) = clients.get(&target_client_uuid) {
                        let origin = client_info.to_origin().with_service(service.info());
                        target_client.send(&payload.with_origin(origin))?;
                        client.send(&PayloadOut::Ok.seq(seq))
                    } else {
                        client.send(&PayloadOut::invalid_uuid(target_client_uuid).seq(seq))
                    }
                } else {
                    client.send(&PayloadOut::invalid_group(service_name).seq(seq))
                }
            }
            Target::All => {
                self.concierge
                    .broadcast(&payload.with_origin(client_info.to_origin()))
                    .await?;
                client.send(&PayloadOut::Ok.seq(seq))
            }
        }
    }
}
