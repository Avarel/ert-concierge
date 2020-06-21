use crate::payload::{error_payloads, Origin, Payload, Target};
use anyhow::{anyhow, Result};
use futures::{Stream, StreamExt};
use warp::ws::Message;
use crate::concierge::Concierge;
use flume::{unbounded, Receiver, Sender};
use tokio::sync::RwLock;
use uuid::Uuid;

pub struct Client {
    /// Client id.
    uuid: Uuid,
    /// Client name.
    name: String,
    /// Sender channel.
    tx: Sender<Message>,
    /// Groups.
    groups: RwLock<Vec<String>>,
}

impl Client {
    /// Create a new client.
    pub fn new(uuid: Uuid, name: String) -> (Self, Receiver<Message>) {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded();
        let groups = RwLock::new(Vec::new());
        (
            Self {
                uuid,
                name,
                tx,
                groups,
            },
            rx,
        )
    }

    // pub fn uuid(&self) -> Uuid {
    //     self.uuid
    // }

    // pub fn name(&self) -> &str {
    //     &self.name
    // }

    /// Utility method to construct an origin receipt on certain payloads.
    pub fn origin_receipt(&self) -> Origin<'_> {
        Origin {
            uuid: self.uuid,
            name: &self.name,
        }
    }

    /// Send a payload.
    pub fn send(&self, payload: Payload) -> Result<()> {
        self.send_ws_msg(Message::text(serde_json::to_string(&payload)?))
    }

    /// Send a WebSocket message.
    pub fn send_ws_msg(&self, msg: Message) -> Result<()> {
        self.tx.send(msg).map_err(|_| anyhow!("Send error"))
    }

    /// Handle incoming payloads with the client information.
    pub async fn handle_incoming_messages(
        &self,
        concierge: &Concierge,
        mut incoming: impl Stream<Item = Result<Message>> + Unpin,
    ) -> Result<()> {
        while let Some(Ok(message)) = incoming.next().await {
            if let Ok(string) = message.to_str() {
                if let Ok(payload) = serde_json::from_str::<Payload>(string) {
                    match payload {
                        Payload::Message { target, data, .. } => match target {
                            Target::Name(name) => {
                                if let Some(client) = concierge
                                    .namespace
                                    .get(name)
                                    .and_then(|id| concierge.clients.get(&id))
                                {
                                    client.send(Payload::Message {
                                        origin: Some(self.origin_receipt()),
                                        target,
                                        data,
                                    })?;
                                } else {
                                    self.send(error_payloads::INVALID_TARGET)?;
                                }
                            }
                            Target::Uuid(uuid) => {
                                if let Some(client) = concierge.clients.get(&uuid) {
                                    client.send(Payload::Message {
                                        origin: Some(self.origin_receipt()),
                                        target,
                                        data,
                                    })?;
                                } else {
                                    self.send(error_payloads::INVALID_TARGET)?;
                                }
                            }
                            Target::Group(group) => {
                                let successful = concierge.broadcast(
                                    group,
                                    Payload::Message {
                                        origin: Some(self.origin_receipt()),
                                        target,
                                        data,
                                    },
                                )?;
                                if successful {
                                    self.send(error_payloads::INVALID_TARGET)?;
                                }
                            }
                        },
                        Payload::Subscribe { group } => {
                            let group_list = crate::util::get_or_compute_group(
                                &concierge.groups,
                                group.to_owned(),
                            );
                            group_list.insert(self.uuid, ());
                            self.groups.write().await.push(group.to_owned());
                        }
                        Payload::Unsubscribe { group } => {
                            if let Some(group) = concierge.groups.get(group) {
                                group.remove(&self.uuid);
                            }
                            let mut groups = self.groups.write().await;
                            if let Some(pos) = groups.iter().position(|x| *x == *group) {
                                groups.remove(pos);
                            }
                        }
                        Payload::Broadcast { data, .. } => {
                            concierge.broadcast_all(Payload::Broadcast {
                                origin: Some(self.origin_receipt()),
                                data,
                            })?
                        }
                        Payload::FetchGroupSubs { group } => {
                            if let Some(group_list) = concierge.groups.get(group) {
                                let uuids = group_list
                                    .iter()
                                    .map(|e| *e.key())
                                    .collect::<Vec<_>>();
                                let names = uuids
                                    .iter()
                                    .filter_map(|uuid| concierge.clients.get(&uuid))
                                    .map(|e| e.name.to_owned())
                                    .collect::<Vec<_>>();
                                self.send(Payload::GroupSubs {
                                    group,
                                    names,
                                    uuids,
                                })?
                            }
                            
                        }
                        Payload::FetchClientList => {
                            let (names, uuids) = concierge
                                .clients
                                .iter()
                                .map(|c| (c.name.to_owned(), c.uuid))
                                .unzip();
                            self.send(Payload::ClientList { names, uuids })?
                        }
                        Payload::FetchGroupList => {
                            let groups = concierge
                                .groups
                                .iter()
                                .map(|e| e.key().to_owned())
                                .collect();
                            self.send(Payload::GroupList { groups })?
                        }
                        Payload::FetchSubs => {
                            let groups = self.groups.read().await.clone();
                            self.send(Payload::Subs { groups })?
                        }
                        _ => self.send(error_payloads::UNSUPPORTED)?,
                    }
                } else {
                    self.send(error_payloads::PROTOCOL)?;
                }
            } else if message.is_ping() {
                self.send_ws_msg(Message::ping(vec![]))?;
            }
        }

        Ok(())
    }
}
