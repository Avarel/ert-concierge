use crate::physics_payload::{EntityDump, EntityUpdate, Payload, PhysicsPayload};
use anyhow::Result;
use concierge_api_rs::payload::{ClientPayload, Origin, Target};
use cs3_physics::{
    ecs::{colliders::{ColliderList, Shape, ColliderPair}, kinetics::{Vel, Pos}, Id, Rgb, dynamics::{GravityList, Mass, GravityPair}},
    specs::prelude::*,
};
use futures::{SinkExt, Stream, StreamExt};
use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Duration,
};
use tokio::{
    sync::{
        mpsc::{unbounded_channel, UnboundedSender},
        RwLock,
    },
    time::delay_for,
};
use tokio_tungstenite::tungstenite::Message;
use url::Url;

pub const MS_SEND_INTERVAL: u64 = 20;

pub const GROUP_TARGET: Target = Target::Group {
    group: crate::PHYSICS_ENGINE_GROUP,
};

pub async fn init_bot(running: Arc<AtomicBool>, world: Arc<RwLock<World>>) -> Result<()> {
    let connect_addr = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "ws://127.0.0.1:64209/ws".to_string());

    let url = Url::parse(&connect_addr).unwrap();
    let (mut ws, _) = tokio_tungstenite::connect_async(url)
        .await
        .expect("Failed to connect");

    ws.send(Message::text(serde_json::to_string(&Payload::Identify {
        name: crate::PHYSICS_ENGINE_NAME,
        nickname: Some("Physics Engine"),
        version: "0.1.1",
        secret: None,
        tags: vec!["simulation"],
    })?))
    .await?;

    if let Some(Ok(Message::Text(string))) = ws.next().await {
        if let Payload::Hello { .. } = serde_json::from_str(&string).unwrap() {
            ws.send(Message::text(
                serde_json::to_string(&Payload::GroupCreate {
                    group: crate::PHYSICS_ENGINE_GROUP,
                })
                .unwrap(),
            ))
            .await?;
        } else {
            panic!("WS did not receive a hello.")
        }
    }

    let (tx, rx) = unbounded_channel();

    let (sink, stream) = ws.split();
    let outgoing_loop = rx.map(Ok).forward(sink);

    tokio::spawn(send_loop(world.clone(), running, tx.clone()));
    tokio::spawn(recv_loop(world, stream, tx));
    tokio::spawn(outgoing_loop);
    Ok(())
}

pub async fn send_loop(
    world: Arc<RwLock<World>>,
    running: Arc<AtomicBool>,
    tx: UnboundedSender<Message>,
) {
    while running.load(Ordering::SeqCst) {
        let world = world.read().await;

        let id = world.read_component::<Id>();
        let pos = world.read_component::<Pos>();

        let updates = (&id, &pos)
            .par_join()
            .map(|(id, pos)| EntityUpdate {
                id: id.0,
                position: pos.0,
            })
            .collect::<Vec<_>>();

        let _ = tx.send(Message::text(
            serde_json::to_string(&Payload::Message {
                origin: None,
                target: Target::Group {
                    group: crate::PHYSICS_ENGINE_GROUP,
                },
                data: PhysicsPayload::PositionDump { updates },
            })
            .unwrap(),
        ));

        delay_for(Duration::from_millis(MS_SEND_INTERVAL)).await;
    }
}

pub async fn recv_loop<T>(
    world: Arc<RwLock<World>>,
    mut stream: impl Stream<Item = Result<Message, T>> + Unpin,
    tx: UnboundedSender<Message>,
) {
    while let Some(Ok(msg)) = stream.next().await {
        if let Ok(string) = msg.to_text() {
            // println!("{}", string);
            match serde_json::from_str::<Payload>(string) {
                Ok(Payload::Message {
                    data: PhysicsPayload::FetchEntities,
                    origin:
                        Some(Origin {
                            client: ClientPayload { uuid, .. },
                            ..
                        }),
                    ..
                }) => {
                    let world = world.read().await;
                    let id = world.read_component::<Id>();
                    let shape = world.read_component::<Shape>();
                    let color = world.read_component::<Rgb>();

                    let entities = (&id, &shape, &color)
                        .par_join()
                        .map(|(id, shape, rgb)| EntityDump {
                            id: id.0.to_owned(),
                            polygon: shape.0.clone(),
                            color: (rgb.0, rgb.1, rgb.2),
                        })
                        .collect::<Vec<_>>();

                    let _ = tx.send(Message::text(
                        serde_json::to_string(&Payload::Message {
                            origin: None,
                            target: Target::Uuid { uuid },
                            data: PhysicsPayload::EntityDump {
                                entities: entities.clone(),
                            },
                        })
                        .unwrap(),
                    ));
                }
                Ok(Payload::Message {
                    data: PhysicsPayload::ToggleColor { id },
                    ..
                }) => {
                    let world = world.read().await;
                    let entities = world.entities();
                    let ids = world.read_component::<Id>();
                    let mut color = world.write_component::<Rgb>();

                    let touched_entity = (&entities, &ids)
                        .par_join()
                        .find_first(|(_, Id(iid))| iid == &id);

                    if let Some((entity, Id(id))) = touched_entity {
                        if let Some(color) = color.get_mut(entity) {
                            *color = match color {
                                Rgb(255, 0, 0) => Rgb(0, 255, 0),
                                Rgb(0, 255, 0) => Rgb(0, 0, 255),
                                Rgb(0, 0, 255) | _ => Rgb(255, 0, 0),
                            };
                            let _ = tx.send(Message::text(
                                serde_json::to_string(&Payload::Message {
                                    origin: None,
                                    target: GROUP_TARGET,
                                    data: PhysicsPayload::ColorUpdate {
                                        id: *id,
                                        color: (color.0, color.1, color.2),
                                    },
                                })
                                .unwrap(),
                            ));
                        }
                    }
                }
                Ok(Payload::Message {
                    data: PhysicsPayload::TouchEntity { id },
                    ..
                }) => {
                    let mut world = world.write().await;
                    let entities = world.entities();
                    let ids = world.read_component::<Id>();

                    let touched_entity = (&entities, &ids)
                        .par_join()
                        .find_first(|(_, Id(iid))| iid == &id)
                        .map(|(e, _)| e.clone());

                    drop(ids);

                    if let Some(touched_entity) = touched_entity {
                        let shapes = world.read_component::<Shape>();
                        let poss = world.read_component::<Pos>();
                        let masss = world.read_component::<Mass>();
                        let colors = world.read_component::<Rgb>();
                        
                        let mut joiner = (&shapes, &poss, &masss, &colors).join();
                        
                        if let Some((shape, &pos, &mass, &rgb)) = joiner.get(touched_entity, &entities) {
                            let shape = shape.clone();

                            let entities_to_bind = entities.par_join().collect::<Vec<_>>();

                            drop(joiner);
                            // drop binding
                            let _ = (colors, masss, poss, shapes, entities);

                            let id = Id::random();

                            let entity = world
                                .create_entity()
                                .with(id)
                                .with(pos)
                                .with(mass)
                                .with(Vel((0.0, 0.0).into()))
                                .with(shape.clone())
                                .with(rgb)
                                .build();

                            let mut gravity = world.write_resource::<GravityList>();
                            let mut colliders = world.write_resource::<ColliderList>();
                            for other_entity in entities_to_bind {
                                gravity.0.push(GravityPair::new(6.673e3, entity, other_entity));
                                colliders.0.push(ColliderPair::new(1.0, entity, other_entity));
                            }

                            tx.send(Message::text(
                                serde_json::to_string(&Payload::Message {
                                    origin: None,
                                    target: GROUP_TARGET,
                                    data: PhysicsPayload::EntityNew {
                                        entity: EntityDump {
                                            id: id.0,
                                            polygon: shape.0,
                                            color: (rgb.0, rgb.1, rgb.2)
                                        }
                                    },
                                })
                                .unwrap(),
                            )).unwrap();
                        }
                    }
                }
                Ok(_) | Err(_) => {}
            }
        }
    }
}
