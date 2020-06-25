use crate::{
    payload::{Origin, Payload},
};
use anyhow::{anyhow, Result};
use flume::{unbounded, Receiver, Sender};
use std::collections::HashSet;
use tokio::sync::RwLock;
use uuid::Uuid;
use warp::ws::Message;

pub struct Client {
    /// Client id.
    uuid: Uuid,
    /// Client name.
    name: String,
    /// Sender channel.
    tx: Sender<Message>,
    /// Groups.
    pub groups: RwLock<HashSet<String>>,
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
                groups: RwLock::default(),
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
}
