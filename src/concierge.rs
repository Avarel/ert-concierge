// File server backend
mod fs;
// Websocket backend
mod ws;

use crate::{clients::Client, payload::Payload};
use anyhow::{Result, anyhow};
use dashmap::DashMap;
use fs::FileReply;
use std::{collections::HashMap, net::SocketAddr};
use tokio::sync::RwLock;
use uuid::Uuid;
use warp::ws::WebSocket;

pub struct Concierge {
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

    pub async fn handle_file_request(&self, string: String) -> Result<FileReply> {
        fs::handle_file_request(self, string).await
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
