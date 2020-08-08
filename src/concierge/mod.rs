mod fs;
mod ws;
pub mod service;
pub mod client;

use client::Client;
use fs::FsConnection;
use log::{debug, error, warn};
use serde::Serialize;
use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::Arc,
};
use tokio::sync::RwLock;
use uuid::Uuid;
use warp::ws::{Message, WebSocket};

pub use fs::FsError;
pub use ws::{SocketConnection, WsError};
use service::Service;

/// Central struct that stores the concierge data.
pub struct Concierge {
    /// This is the groups registered in the Concierge.
    pub services: RwLock<HashMap<String, Service>>,
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
            services: RwLock::default(),
            clients: RwLock::default(),
            namespace: RwLock::default(),
        }
    }

    /// Broadcast a payload to all clients.
    pub async fn broadcast(&self, payload: &impl Serialize) -> Result<(), WsError> {
        let message = Message::text(serde_json::to_string(&payload)?);
        for (_, client) in self.clients.read().await.iter() {
            client.send_ws_msg(message.clone()).ok();
        }
        Ok(())
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

    pub fn fs_conn(self: Arc<Self>) -> FsConnection {
        FsConnection::new(self)
    }
}
