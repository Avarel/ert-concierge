use crate::concierge_api::{Origin, Target};
use crate::physics_payload::{EntityDump, EntityUpdate, Payload, PhysicsPayload};
use anyhow::Result;
use cs3_physics::{
    ecs::{colliders::Shape, kinetics::Pos, Id, Rgb},
    specs::prelude::*,
};
use futures::{future, pin_mut, SinkExt, Stream, StreamExt};
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender};
use tokio_tungstenite::tungstenite::Message;
use url::Url;
use uuid::Uuid;

type WebSocket = tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>;

type Tx = UnboundedSender<Message>;
type Rx = UnboundedReceiver<Message>;

type Queue<T> = Arc<Mutex<Vec<T>>>;

struct WsClient {
    ws_stream: WebSocket,
}

impl<'a> WsClient {
    pub async fn connect(connect_addr: &str) -> Self {
        let url = Url::parse(connect_addr).unwrap();
        let (ws_stream, _) = tokio_tungstenite::connect_async(url)
            .await
            .expect("Failed to connect");
        Self { ws_stream }
    }

    pub async fn send_message(&'a mut self, payload: Payload<'a>) {
        self.ws_stream
            .send(Message::text(serde_json::to_string(&payload).unwrap()))
            .await
            .unwrap()
    }

    pub async fn next_message(&'a mut self) -> Message {
        self.ws_stream
            .next()
            .await
            .expect("No payload")
            .expect("Protocol error")
    }

    pub fn into_inner(self) -> WebSocket {
        self.ws_stream
    }
}

/// Create new systems that connects to the concierge
/// and publish the data of the simulation.
pub fn init_systems() -> (EntityDumpSys, ColorUpdateSys, PositionDumpSys) {
    println!("Initializing concierge systems");

    // Connect to specific address provided in command arguments, or fall back to default
    let connect_addr = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "ws://127.0.0.1:64209/ws".to_string());

    // This is our channels for messages.
    let (tx, rx) = unbounded_channel();

    let (entity_dump_sys, eds_queue) = EntityDumpSys::new(tx.clone());
    let (color_update_sys, cus_queue) = ColorUpdateSys::new(tx.clone());
    let position_dump_sys = PositionDumpSys::new(tx);

    tokio::spawn(create_server_future(eds_queue, cus_queue, rx, connect_addr));

    println!("Finished concierge systems");

    (entity_dump_sys, color_update_sys, position_dump_sys)
}

async fn create_server_future<'a>(
    eds_queue: Queue<Uuid>,
    cus_queue: Queue<String>,
    rx: Rx,
    connect_addr: impl ToString,
) {
    let mut client = WsClient::connect(&connect_addr.to_string()).await;

    client
        .send_message(Payload::Identify {
            name: crate::PHYSICS_ENGINE_NAME,
            version: "0.1.0",
            secret: None
        })
        .await;

    if let Message::Text(string) = client.next_message().await {
        if let Payload::Hello { .. } = serde_json::from_str(&string).unwrap() {
            client
                .send_message(Payload::CreateGroup {
                    group: crate::PHYSICS_ENGINE_GROUP,
                })
                .await;

            let (outgoing, incoming) = client.into_inner().split();

            let incoming_handler = incoming_loop(eds_queue, cus_queue, incoming);
            let receive_forward = rx.map(Ok).forward(outgoing);

            pin_mut!(incoming_handler, receive_forward);
            future::select(incoming_handler, receive_forward).await;

            return;
        }
        panic!("WS did not receive a hello.")
    }
    panic!("WS did not receive a text message.")
}

pub async fn incoming_loop<E>(
    eds_queue: Queue<Uuid>,
    cus_queue: Queue<String>,
    mut incoming: impl Stream<Item = Result<Message, E>> + Unpin,
) -> Result<()> {
    while let Some(Ok(message)) = incoming.next().await {
        if let Ok(string) = message.to_text() {
            if let Ok(payload) = serde_json::from_str::<Payload>(string) {
                match payload {
                    Payload::Message {
                        origin: Some(Origin { uuid, .. }),
                        data,
                        ..
                    } => match data {
                        PhysicsPayload::FetchEntities => eds_queue.lock().unwrap().push(uuid),
                        PhysicsPayload::ToggleColor { id } => {
                            cus_queue.lock().unwrap().push(id.to_string())
                        }
                        _ => {}
                    },
                    Payload::Status { code } => {
                        if code != "MESSAGE_SENT" {
                            println!("{}", code);
                        }
                    }
                    _ => {}
                }
            }
        }
    }

    Ok(())
}

pub struct ColorUpdateSys {
    queue: Arc<Mutex<Vec<String>>>,
    tx: Tx,
}

impl ColorUpdateSys {
    fn new(tx: Tx) -> (Self, Queue<String>) {
        let queue = Queue::default();
        (
            Self {
                queue: queue.clone(),
                tx,
            },
            queue,
        )
    }

    fn send(&self, payload: Payload) {
        self.tx
            .send(Message::Text(serde_json::to_string(&payload).unwrap()))
            .ok();
    }
}

impl<'a> System<'a> for ColorUpdateSys {
    type SystemData = (Entities<'a>, ReadStorage<'a, Id>, WriteStorage<'a, Rgb>);
    fn run(&mut self, (entities, id, mut color): Self::SystemData) {
        let mut queue = self.queue.lock().unwrap();
        let toggled_entities = (&entities, &id)
            .par_join()
            .filter(|(_, Id(id))| queue.contains(id))
            .collect::<Vec<_>>();
        queue.clear();
        drop(queue);

        for (entity, Id(id)) in toggled_entities {
            if let Some(color) = color.get_mut(entity) {
                *color = match color {
                    Rgb(255, 0, 0) => Rgb(0, 255, 0),
                    Rgb(0, 255, 0) => Rgb(0, 0, 255),
                    Rgb(0, 0, 255) | _ => Rgb(255, 0, 0),
                };
                self.send(Payload::Message {
                    origin: None,
                    target: Target::Group {
                        group: crate::PHYSICS_ENGINE_GROUP,
                    },
                    data: PhysicsPayload::ColorUpdate {
                        id,
                        color: (color.0, color.1, color.2),
                    },
                })
            }
        }
    }
}

pub struct EntityDumpSys {
    queue: Queue<Uuid>,
    tx: Tx,
}

impl EntityDumpSys {
    fn new(tx: Tx) -> (Self, Queue<Uuid>) {
        let queue = Queue::default();
        (
            Self {
                queue: queue.clone(),
                tx,
            },
            queue,
        )
    }

    fn send(&self, payload: Payload) {
        self.tx
            .send(Message::Text(serde_json::to_string(&payload).unwrap()))
            .ok();
    }
}

impl<'a> System<'a> for EntityDumpSys {
    type SystemData = (
        ReadStorage<'a, Id>,
        ReadStorage<'a, Shape>,
        ReadStorage<'a, Rgb>,
    );
    fn run(&mut self, (id, shape, color): Self::SystemData) {
        let mut queue = self.queue.lock().unwrap();
        if !queue.is_empty() {
            let entities = (&id, &shape, &color)
                .par_join()
                .map(|(id, shape, rgb)| EntityDump {
                    id: id.0.to_owned(),
                    polygon: shape.0.clone(),
                    color: (rgb.0, rgb.1, rgb.2),
                })
                .collect::<Vec<_>>();

            for uuid in queue.drain(..) {
                println!("Entity dump to: {}", uuid);
                self.send(Payload::Message {
                    origin: None,
                    target: Target::Uuid { uuid },
                    data: PhysicsPayload::EntityDump {
                        entities: entities.clone(),
                    },
                });
            }
        }
    }
}

pub struct PositionDumpSys {
    tx: Tx,
}

impl<'a> PositionDumpSys {
    fn new(tx: Tx) -> Self {
        Self { tx }
    }

    fn send(&self, payload: Payload) {
        self.tx
            .send(Message::Text(serde_json::to_string(&payload).unwrap()))
            .ok();
    }
}

impl<'a> System<'a> for PositionDumpSys {
    type SystemData = (ReadStorage<'a, Id>, ReadStorage<'a, Pos>);
    fn run(&mut self, (id, pos): Self::SystemData) {
        let updates = (&id, &pos)
            .par_join()
            .map(|(id, pos)| EntityUpdate {
                id: id.0.to_owned(),
                position: pos.0,
            })
            .collect::<Vec<_>>();

        self.send(Payload::Message {
            origin: None,
            target: Target::Group {
                group: crate::PHYSICS_ENGINE_GROUP,
            },
            data: PhysicsPayload::PositionDump { updates },
        })
    }
}
