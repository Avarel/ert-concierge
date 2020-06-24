// File server backend
mod fs;
// Websocket backend
mod ws;

use crate::{
    clients::Client,
    payload::{ok_payloads, Payload},
};
use anyhow::{anyhow, Result};
use dashmap::DashMap;
use fs::FileReply;
use futures::Stream;
use hyper::StatusCode;
use std::{collections::HashMap, net::SocketAddr};
use tokio::sync::RwLock;
use uuid::Uuid;
use warp::{ws::WebSocket, Buf};

pub struct Concierge {
    /// This is the groups registered in the Concierge.
    pub groups: DashMap<String, Group>,
    /// This is the namespace of the Concierge.
    /// It uses an RwLock in order to prevent race conditions.
    pub namespace: RwLock<HashMap<String, Uuid>>,
    /// This is the mapping between UUID and Clients. There
    /// is no lock since UUID statistically will not collide.
    pub clients: DashMap<Uuid, Client>,
}

impl Concierge {
    /// Creates a new concierge.
    pub fn new() -> Self {
        Self {
            groups: DashMap::new(),
            clients: DashMap::new(),
            namespace: RwLock::new(HashMap::new()),
        }
    }

    pub fn broadcast_all(&self, payload: Payload) -> Result<()> {
        ws::broadcast_all(self, payload)
    }

    pub fn remove_group(&self, group: &str, owner_id: Uuid) -> bool {
        self.groups.remove_if(group, |group_name, group| {
            if group.owner == owner_id {
                ws::broadcast(self, group, ok_payloads::unsubscribed(group_name)).ok();
                true
            } else {
                false
            }
        })
    }

    pub fn remove_groups_owned_by(&self, owner_id: Uuid) {
        self.groups.retain(|group_name, group| {
            if group.owner != owner_id {
                ws::broadcast(self, group, ok_payloads::unsubscribed(group_name)).ok();
                true
            } else {
                false
            }
        });
    }

    pub fn remove_from_all_groups(&self, uuid: Uuid) {
        self.groups.iter().for_each(|group| {
            group.clients.remove(&uuid);
        });
    }

    pub async fn remove_name(&self, name: &str) {
        self.namespace.write().await.remove(name);
    }

    pub async fn remove_client(&self, uuid: Uuid) -> Result<()> {
        let client = self
            .clients
            .remove_take(&uuid)
            .ok_or_else(|| anyhow!("Tried to remove a client that does not exist"))?;
        // Remove from namespace
        self.remove_name(client.name()).await;
        // Remove any owned groups
        self.remove_groups_owned_by(client.uuid());
        // Remove from groups
        self.remove_from_all_groups(client.uuid());
        Ok(())
    }

    pub async fn handle_socket_conn(
        &self,
        socket: WebSocket,
        addr: Option<SocketAddr>,
    ) -> Result<()> {
        // Connection must have an incoming socket address
        if let Some(addr) = addr {
            ws::handle_socket_conn(self, socket, addr).await
        } else {
            socket.close().await?;
            Err(anyhow!("A client joined without any ip."))
        }
    }

    pub async fn handle_file_get(&self, auth: Uuid, tail: &str) -> Result<FileReply> {
        fs::handle_file_get(self, auth, tail).await
    }

    // pub async fn handle_file_put(
    //     &self,
    //     auth: Uuid,
    //     tail: &str,
    //     stream: impl Stream<Item = Result<impl Buf, warp::Error>> + Unpin,
    // ) -> Result<StatusCode> {
    //     fs::handle_file_put(self, auth, tail, stream).await
    // }

    pub async fn handle_file_put2(
        &self,
        auth: Uuid,
        tail: &str,
        stream: impl Buf,
    ) -> Result<StatusCode> {
        fs::handle_file_put2(self, auth, tail, stream).await
    }


    pub async fn handle_file_delete(&self, auth: Uuid, tail: &str) -> Result<StatusCode> {
        fs::handle_file_delete(self, auth, tail).await
    }
}

pub struct Group {
    pub name: String,
    pub owner: Uuid,
    pub clients: DashMap<Uuid, ()>,
}

impl Group {
    pub fn new(name: String, owner: Uuid) -> Self {
        Self {
            name,
            owner,
            clients: DashMap::new(),
        }
    }

    /// Broadcast a payload to all connected client of a certain group.
    pub fn broadcast(&self, concierge: &Concierge, payload: Payload) -> Result<()> {
        ws::broadcast(concierge, self, payload)
    }
}
