//! `ChatServer` is an actor. It maintains list of connection client session.
//! And manages available rooms. Peers send messages to other peers in same
//! room through `ChatServer`.

use actix::prelude::*;
use std::collections::HashMap;
use uuid::Uuid;

/// Chat server sends this messages to session
#[derive(Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

/// Message for chat server communications

/// New chat session is created
#[derive(Message)]
#[rtype(result = "Uuid")]
pub struct Connect {
    pub addr: Recipient<Message>,
}

/// Session is disconnected
#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: Uuid,
}

/// Send message to specific room
#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientMessage {
    /// Id of the client session
    pub id: Uuid,
    /// Peer message
    pub msg: String,
    /// Room name
    pub room: String,
}

/// Join room, if room does not exists create new one.
#[derive(Message)]
#[rtype(result = "()")]
pub struct Join {
    /// Client id
    pub id: Uuid,
    /// Room name
    pub name: String,
}

pub struct Service;
pub struct Client;

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
    fn new() -> Self {
        Concierge {
            services: HashMap::new(),
            namespace: HashMap::new(),
            clients: HashMap::new()
        }
    }

    /// Send message to all users in the room
    fn send_message(&self, room: &str, message: &str, skip_id: Uuid) {
        // if let Some(sessions) = self.rooms.get(room) {
        //     for id in sessions {
        //         if *id != skip_id {
        //             if let Some(addr) = self.sessions.get(id) {
        //                 let _ = addr.do_send(Message(message.to_owned()));
        //             }
        //         }
        //     }
        // }
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
impl Handler<Connect> for Concierge {
    type Result = MessageResult<Connect>;

    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        println!("Someone joined");

        // // notify all users in same room
        // self.send_message(&"Main".to_owned(), "Someone joined", Uuid::nil());

        // // register session with random id
        let id = Uuid::new_v4();
        // self.sessions.insert(id, msg.addr);

        // // auto join session to Main room
        // self.rooms
        //     .entry("Main".to_owned())
        //     .or_insert(HashSet::new())
        //     .insert(id);

        // send id back
        MessageResult(id)
    }
}

/// Handler for Disconnect message.
impl Handler<Disconnect> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        println!("Someone disconnected");

        let mut rooms: Vec<String> = Vec::new();

        // // remove address
        // if self.sessions.remove(&msg.id).is_some() {
        //     // remove session from all rooms
        //     for (name, sessions) in &mut self.rooms {
        //         if sessions.remove(&msg.id) {
        //             rooms.push(name.to_owned());
        //         }
        //     }
        // }
        // send message to other users
        for room in rooms {
            self.send_message(&room, "Someone disconnected", Uuid::nil());
        }
    }
}

/// Handler for Message message.
impl Handler<ClientMessage> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: ClientMessage, _: &mut Context<Self>) {
        self.send_message(&msg.room, msg.msg.as_str(), msg.id);
    }
}

/// Join room, send disconnect message to old room
/// send join message to new room
impl Handler<Join> for Concierge {
    type Result = ();

    fn handle(&mut self, msg: Join, _: &mut Context<Self>) {
        let Join { id, name } = msg;
        // let mut rooms = Vec::new();

        // // remove session from all rooms
        // for (n, sessions) in &mut self.rooms {
        //     if sessions.remove(&id) {
        //         rooms.push(n.to_owned());
        //     }
        // }
        // // send message to other users
        // for room in rooms {
        //     self.send_message(&room, "Someone disconnected", Uuid::nil());
        // }

        // self.rooms
        //     .entry(name.clone())
        //     .or_insert(HashSet::new())
        //     .insert(id);

        self.send_message(&name, "Someone connected", id);
    }
}