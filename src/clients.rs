use crate::concierge::{self, Concierge};
use crate::payload::{err_payloads, Origin, OwnedOrigin, Payload, Target, ok_payloads};
use anyhow::{anyhow, Result};
use concierge::Group;
use flume::{unbounded, Receiver, Sender};
use futures::{Stream, StreamExt};
use tokio::sync::RwLock;
use uuid::Uuid;
use warp::ws::Message;
use std::collections::HashSet;

pub struct Client {
    /// Client id.
    uuid: Uuid,
    /// Client name.
    name: String,
    /// Sender channel.
    tx: Sender<Message>,
    /// Groups.
    groups: RwLock<HashSet<String>>,
    // /// Files.
    // files: RwLock<HashMap<PathBuf, ClientFile>>
}

// pub struct ClientFile {
//     targets: Option<HashSet<Uuid>>,
// }

// impl ClientFile {
//     pub fn no_target() -> Self {
//         Self {
//             targets: None
//         }
//     }

//     pub fn targeted(targets: HashSet<Uuid>) -> Self {
//         Self {
//             targets: Some(targets)
//         }
//     }
// }

impl Client {
    /// Create a new client.
    pub fn new(uuid: Uuid, name: String) -> (Self, Receiver<Message>) {
        // This is our channels for messages.
        // rx: (receive) where messages are received
        // tx: (transmit) where we send messages
        let (tx, rx) = unbounded();
        (
            Self {
                uuid,
                name,
                tx,
                groups: RwLock::default()
            },
            rx,
        )
    }

    pub fn uuid(&self) -> Uuid {
        self.uuid
    }

    pub fn name(&self) -> &str {
        &self.name
    }

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
                    self.handle_payload(concierge, payload).await?;
                } else {
                    self.send(err_payloads::PROTOCOL)?;
                }
            }
        }

        Ok(())
    }

    // /// Add a file that the client manages.
    // pub async fn add_file(&self, path: PathBuf, file: ClientFile) {
    //     self.files.write().await.insert(path, file);
    // }

    // /// Update the file using a function.
    // pub async fn update_file(&self, path: &Path, f: impl FnOnce(&mut ClientFile)) {
    //     self.files.write().await.get_mut(path).map(f);
    // }

    // /// Remove the file using a function.
    // pub async fn remove_file(&self, path: &Path) {
    //     self.files.write().await.remove(path);
    // }

    async fn handle_message(
        &self,
        concierge: &Concierge,
        target: Target<'_>,
        data: serde_json::Value,
    ) -> Result<()> {
        match target {
            Target::Name { name } => {
                if let Some(client) = concierge
                    .namespace
                    .read()
                    .await
                    .get(name)
                    .and_then(|id| concierge.clients.get(&id))
                {
                    client.send(Payload::Message {
                        origin: Some(self.origin_receipt()),
                        target,
                        data,
                    })?;
                    self.send(ok_payloads::MESSAGE_SENT)
                } else {
                    self.send(err_payloads::no_such_name(name))
                }
            }
            Target::Uuid { uuid } => {
                if let Some(client) = concierge.clients.get(&uuid) {
                    client.send(Payload::Message {
                        origin: Some(self.origin_receipt()),
                        target,
                        data,
                    })?;
                    self.send(ok_payloads::MESSAGE_SENT)
                } else {
                    self.send(err_payloads::no_such_uuid(uuid))
                }
            }
            Target::Group { group } => {
                if let Some(group) = concierge.groups.get(group) {
                    group.broadcast(
                        concierge,
                        Payload::Message {
                            origin: Some(self.origin_receipt()),
                            target,
                            data,
                        },
                    )?;
                    self.send(ok_payloads::MESSAGE_SENT)
                } else {
                    self.send(err_payloads::no_such_group(group))
                }
            }
        }
    }

    async fn handle_payload(&self, concierge: &Concierge, payload: Payload<'_>) -> Result<()> {
        match payload {
            Payload::Message { target, data, .. } => {
                self.handle_message(concierge, target, data).await?
            }
            Payload::Subscribe { group } => {
                if let Some(group) = concierge.groups.get(group) {
                    group.clients.insert(self.uuid, ());
                    self.groups.write().await.insert(group.name.to_owned());
                    self.send(ok_payloads::subscribed(group.key()))?;
                } else {
                    self.send(err_payloads::no_such_group(group))?;
                }
            }
            Payload::Unsubscribe { group } => {
                if let Some(group) = concierge.groups.get(group) {
                    group.clients.remove(&self.uuid);
                    self.send(ok_payloads::unsubscribed(group.key()))?;
                } else {
                    self.send(err_payloads::no_such_group(group))?;
                }

                let mut groups = self.groups.write().await;
                groups.remove(group);
            }
            Payload::CreateGroup { group } => {
                if !concierge.groups.contains_key(group) {
                    concierge
                        .groups
                        .insert(group.to_owned(), Group::new(group.to_owned(), self.uuid));
                    self.send(ok_payloads::created_group(group))?;
                } else {
                    self.send(err_payloads::group_already_created(group))?;
                }
            }
            Payload::DeleteGroup { group } => {
                if concierge.remove_group(group, self.uuid) {
                    self.send(ok_payloads::deleted_group(group))?;
                } else {
                    self.send(err_payloads::no_such_group(group))?;
                }
            }
            Payload::Broadcast { data, .. } => {
                concierge.broadcast_all(Payload::Broadcast {
                    origin: Some(self.origin_receipt()),
                    data,
                })?;
                self.send(ok_payloads::MESSAGE_SENT)?;
            },
            Payload::FetchGroupSubs { group } => {
                if let Some(group) = concierge.groups.get(group) {
                    let clients = group
                        .clients
                        .iter()
                        .filter_map(|e| concierge.clients.get(e.key()))
                        .map(|c| OwnedOrigin {
                            name: c.name.to_owned(),
                            uuid: c.uuid,
                        })
                        .collect::<Vec<_>>();
                    self.send(Payload::GroupSubs {
                        group: &group.name,
                        clients,
                    })?;
                }
            }
            Payload::FetchClientList => {
                let clients = concierge
                    .clients
                    .iter()
                    .map(|c| OwnedOrigin {
                        name: c.name.to_owned(),
                        uuid: c.uuid,
                    })
                    .collect::<Vec<_>>();
                self.send(Payload::ClientList { clients })?;
            }
            Payload::FetchGroupList => {
                let groups = concierge
                    .groups
                    .iter()
                    .map(|e| e.key().to_owned())
                    .collect();
                self.send(Payload::GroupList { groups })?;
            }
            Payload::FetchSubs => {
                let groups = self.groups.read().await.clone();
                self.send(Payload::Subs { groups })?
            }
            _ => self.send(err_payloads::UNSUPPORTED)?,
        }
        Ok(())
    }
}
