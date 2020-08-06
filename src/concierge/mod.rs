mod fs;
mod ws;

use crate::clients::Client;
use concierge_api_rs::{payload::GroupPayload, status::ok};
use fs::FsError;
use log::{debug, error, warn};
use serde::Serialize;
use std::{
    borrow::Cow,
    collections::{HashMap, HashSet},
    net::SocketAddr,
    sync::Arc,
};
use tokio::sync::RwLock;
use uuid::Uuid;
use warp::{multipart::FormData, ws::WebSocket, Buf, Rejection, Reply};
pub use ws::{SocketConnection, WsError};

/// Central struct that stores the concierge data.
pub struct Concierge {
    /// This is the groups registered in the Concierge.
    pub groups: RwLock<HashMap<String, Group>>,
    /// This is the namespace of the Concierge.
    /// It uses an RwLock in order to prevent race conditions.
    pub namespace: RwLock<HashMap<String, Uuid>>,
    /// This is the mapping between UUID and Clients. There
    /// is no lock since UUID statistically will not collide.
    pub clients: RwLock<HashMap<Uuid, Client>>,
}

impl Concierge {
    /// Creates a new concierge.
    pub fn new() -> Self {
        Self {
            groups: RwLock::default(),
            clients: RwLock::default(),
            namespace: RwLock::default(),
        }
    }

    /// Broadcast a payload to all clients.
    pub async fn broadcast_all(&self, payload: &impl Serialize) -> Result<(), WsError> {
        ws::broadcast_all(self, payload).await
    }

    /// Broadcast a payload to all clients except the excluded client.
    pub async fn broadcast_all_except(
        &self,
        payload: &impl Serialize,
        uuid: Uuid,
    ) -> Result<(), WsError> {
        ws::broadcast_all_except(self, payload, uuid).await
    }

    /// Create a group if it currently does not exist in the concierge.
    /// Returns `true` if the group was created.
    ///
    /// # NOTE
    /// This will broadcast an `GROUP_CREATED` status to everyone connected to the concierge.
    /// The caller must handle telling the owner that the group has been created.
    pub async fn create_group(
        &self,
        name: &str,
        nickname: Option<&str>,
        owner_id: Uuid,
    ) -> Result<bool, WsError> {
        let mut groups = self.groups.write().await;
        if !groups.contains_key(name) {
            groups.insert(
                name.to_owned(),
                Group::new(name.to_owned(), nickname.map(str::to_string), owner_id),
            );
            self.broadcast_all_except(&ok::created_group(None, name), owner_id)
                .await?;
            Ok(true)
        } else {
            Ok(false)
        }
    }

    /// Remove a group if a client is the owner of that group.
    /// Returns `true` if the group was removed.
    ///
    /// # NOTE
    /// This will broadcast an `UNSUBSCRIBED` status to everyone connected to the group.
    /// It will also broadcast a `GROUP_DELETE` status to everyone connected to the concierge
    /// except the owner. The caller must handle telling the owner that their group has
    /// been deleted (so that they can attach a sequence number).
    pub async fn remove_group(&self, group_name: &str, owner_id: Uuid) -> Result<bool, WsError> {
        let mut groups = self.groups.write().await;

        if let Some(group) = groups.get(group_name) {
            if group.owner_uuid == owner_id {
                // ws::broadcast(self, group, ok::unsubscribed(None, group_name))
                //     .await?;
                // Note: The caller will handle telling the owner
                self.broadcast_all_except(&ok::deleted_group(None, group_name), owner_id)
                    .await?;
                groups.remove(group_name);
                return Ok(true);
            }
        }

        return Ok(false);
    }

    /// Remove all groups owned by a client.
    async fn remove_groups_owned_by(&self, owner_id: Uuid) -> Result<(), WsError> {
        let mut groups = self.groups.write().await;
        let removing = groups
            .iter()
            .filter(|(_, group)| group.owner_uuid == owner_id)
            .map(|(name, _)| name.to_owned())
            .collect::<Vec<_>>();

        for key in removing {
            let group = groups.remove(&key).unwrap();
            ws::broadcast(self, &group, &ok::unsubscribed(None, &key)).await?;
            // NOTE: This is only called when the owner leaves, so we can safely ignore the owner
            self.broadcast_all(&ok::deleted_group(None, &key)).await?;
        }
        return Ok(());
    }

    /// Remove a client from all groups.
    pub async fn remove_from_all_groups(&self, uuid: Uuid) {
        self.groups.write().await.iter_mut().for_each(|(_, group)| {
            group.clients.remove(&uuid);
        });
    }

    /// Remove a client from clientspace, namespace, their owned groups, and
    /// them from any of their subscribed groups.
    pub async fn remove_client(&self, uuid: Uuid) -> Result<Client, WsError> {
        let client = self
            .clients
            .write()
            .await
            .remove(&uuid)
            .ok_or_else(|| WsError::Internal)?;
        // Remove from namespace
        self.namespace.write().await.remove(client.name());
        // Remove any owned groups
        self.remove_groups_owned_by(client.uuid()).await?;
        // Remove from groups
        self.remove_from_all_groups(client.uuid()).await;
        Ok(client)
    }

    /// Handle new socket connections
    pub async fn handle_socket_conn(self: Arc<Self>, socket: WebSocket, addr: Option<SocketAddr>) {
        // Connection must have an incoming socket address
        if let Some(addr) = addr {
            let socket_conn = SocketConnection::new(self);
            if let Err(err) = socket_conn.handle_socket_conn(socket, addr).await {
                error!("WS error: {:?}", err);
            }
        } else {
            warn!("Client joined without address.");
            if let Err(err) = socket.close().await {
                error!("WS failed to close: {}", err);
            }
        }
        debug!("Socket connection (addr: {:?}) dropped.", addr)
    }

    /// Handle file server GET requests
    pub async fn handle_file_get(
        self: Arc<Self>,
        name: String,
        auth: Uuid,
        tail: &str,
    ) -> Result<impl Reply, Rejection> {
        fs::handle_file_get(&self, name, auth, tail)
            .await
            .map_err(FsError::rejection)
    }

    /// Handle file server PUT requests
    pub async fn handle_file_put(
        self: Arc<Self>,
        name: String,
        auth: Uuid,
        tail: &str,
        stream: impl Buf,
    ) -> Result<impl Reply, Rejection> {
        fs::handle_file_put(&self, name, auth, tail, stream)
            .await
            .map_err(FsError::rejection)
    }

    pub async fn handle_file_put_multipart(
        self: Arc<Self>,
        name: String,
        auth: Uuid,
        tail: &str,
        data: FormData,
    ) -> Result<impl Reply, Rejection> {
        fs::handle_file_put_multipart(&self, name, auth, tail, data)
            .await
            .map_err(FsError::rejection)
    }

    /// Handle file server DELETE requests
    pub async fn handle_file_delete(
        self: Arc<Self>,
        name: String,
        auth: Uuid,
        tail: &str,
    ) -> Result<impl Reply, Rejection> {
        fs::handle_file_delete(&self, name, auth, tail)
            .await
            .map_err(FsError::rejection)
    }
}

/// A struct containing group information.
pub struct Group {
    pub name: String,
    pub nickname: Option<String>,
    pub owner_uuid: Uuid,
    pub clients: HashSet<Uuid>,
}

impl Group {
    /// Create a new group associated with an owner uuid.
    pub fn new(name: String, nickname: Option<String>, owner_uuid: Uuid) -> Self {
        Self {
            name,
            nickname,
            owner_uuid,
            clients: HashSet::new(),
        }
    }

    /// Utility method to construct an origin receipt on certain payloads.
    pub fn make_payload(&self) -> GroupPayload<'_> {
        GroupPayload {
            name: Cow::Borrowed(&self.name),
            nickname: self.nickname.as_deref().map(Cow::Borrowed),
            owner_uuid: self.owner_uuid,
            subscribers: self.clients.iter().copied().collect::<Vec<_>>(),
        }
    }

    /// Add the client to the group.
    pub fn add_subscriber(&mut self, _: &Concierge, uuid: Uuid) {
        self.clients.insert(uuid);
    }

    /// Remove the client from the group.
    pub fn remove_subscriber(&mut self, _: &Concierge, uuid: &Uuid) {
        self.clients.remove(&uuid);
    }

    /// Broadcast a payload to all connected client of a certain group.
    pub async fn broadcast(
        &self,
        concierge: &Concierge,
        payload: &impl Serialize,
    ) -> Result<(), WsError> {
        ws::broadcast(concierge, self, payload).await
    }
}
