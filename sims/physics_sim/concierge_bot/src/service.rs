use crate::physics_payload::{EntityDump, EntityUpdate, Payload, PhysicsPayload};
use anyhow::Result;
use concierge_api_rs::{
    payload::{ClientInfo, OriginInfo, Target},
    status::StatusPayload,
};
use cs3_physics::{
    ecs::{
        colliders::{ColliderList, ColliderPair, Shape},
        dynamics::{GravityList, GravityPair, Mass},
        kinetics::{Pos, Vel},
        Id, Owner, Rgb,
    },
    polygon::Polygon,
    specs::prelude::*,
    vector::Vec2f,
};
use futures::{SinkExt, Stream, StreamExt};
use palette;
use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::{UNIX_EPOCH, Duration, SystemTime},
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

pub const GROUP_TARGET: Target = Target::Service {
    name: crate::PHYSICS_ENGINE_GROUP,
};

fn color_from_string_hash(string: &str) -> (u8, u8, u8) {
    fn js_hash_string(string: &str) -> u32 {
        let mut hash = 0;
        for c in string.chars() {
            hash = ((hash << 5) - hash) + c as u32;
            hash |= 0;
        }
        return hash;
    }

    let hash = js_hash_string(string);
    let h = hash % 360;
    let hsv = palette::Hsv::new(h as f32, 1.0, 0.50);
    let rgb = palette::LinSrgb::from(hsv);
    return (
        (rgb.red * 255.0) as u8,
        (rgb.green * 255.0) as u8,
        (rgb.blue * 255.0) as u8,
    );
}

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
        version: "0.2.0",
        secret: None,
        tags: vec!["simulation"],
    })?))
    .await?;

    if let Some(Ok(Message::Text(string))) = ws.next().await {
        if let Payload::Hello { .. } = serde_json::from_str(&string).unwrap() {
            ws.send(Message::text(
                serde_json::to_string(&Payload::ServiceCreate {
                    name: crate::PHYSICS_ENGINE_GROUP,
                    nickname: Some("Physics Engine Channel")
                })
                .unwrap(),
            ))
            .await?;
            ws.send(Message::text(
                serde_json::to_string(&Payload::SelfSubscribe {
                    name: crate::PHYSICS_ENGINE_GROUP
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
                target: Target::Service {
                    name: crate::PHYSICS_ENGINE_GROUP,
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
            match serde_json::from_str::<Payload>(string) {
                Ok(Payload::Message {
                    data,
                    origin: Some(OriginInfo { client, .. }),
                    ..
                }) => {
                    handle_message(data, client, &world, &tx).await;
                }
                Ok(Payload::Status {
                    data: StatusPayload::ServiceClientSubscribed { client, service },
                    ..
                }) if service.name == crate::PHYSICS_ENGINE_GROUP => {
                    println!("Client {} subscribed!", client.name);
                }
                Ok(Payload::Status {
                    data: StatusPayload::ServiceClientUnsubscribed { client, service },
                    ..
                }) if service.name == crate::PHYSICS_ENGINE_GROUP => {
                    println!("Client {} unsubscribed!", client.name);

                    let mut world = world.write().await;
                    let entities = world.entities();
                    let owners = world.read_component::<Owner>();
                    let to_delete = (&entities, &owners)
                        .par_join()
                        .filter(|(_, owner)| owner.0 == client.uuid)
                        .map(|(ent, _)| ent)
                        .collect::<Vec<_>>();
                    drop(owners);
                    drop(entities);

                    let ids = world.read_component::<Id>();
                    let ids_to_delete = to_delete
                        .iter()
                        .filter_map(|ent| ids.get(*ent))
                        .map(|id| id.0)
                        .collect::<Vec<_>>();
        
                    tx.send(Message::text(
                        serde_json::to_string(&Payload::Message {
                            origin: None,
                            target: GROUP_TARGET,
                            data: PhysicsPayload::EntityDelete { ids: ids_to_delete },
                        })
                        .unwrap(),
                    ))
                    .unwrap();
        
                    drop(ids);
        
                    world.delete_entities(&to_delete).expect("Delete fail");
                }
                Ok(_) | Err(_) => {}
            }
        }
    }
}

async fn handle_message(
    data: PhysicsPayload<'_>,
    client: ClientInfo<'_>,
    world: &RwLock<World>,
    tx: &UnboundedSender<Message>,
) {
    match data {
        PhysicsPayload::SpawnEntity => {
            let mut world = world.write().await;
            /* Delete all your current entitties. */
            let entities = world.entities();
            let owners = world.read_component::<Owner>();
            let to_delete = (&entities, &owners)
                .par_join()
                .filter(|(_, owner)| owner.0 == client.uuid)
                .map(|(ent, _)| ent)
                .collect::<Vec<_>>();
            drop(owners);

            let entities_to_bind = entities.par_join().collect::<Vec<_>>();
            drop(entities);

            let ids = world.read_component::<Id>();
            let ids_to_delete = to_delete
                .iter()
                .filter_map(|ent| ids.get(*ent))
                .map(|id| id.0)
                .collect::<Vec<_>>();

            tx.send(Message::text(
                serde_json::to_string(&Payload::Message {
                    origin: None,
                    target: GROUP_TARGET,
                    data: PhysicsPayload::EntityDelete { ids: ids_to_delete },
                })
                .unwrap(),
            ))
            .unwrap();

            drop(ids);

            world.delete_entities(&to_delete).expect("Delete fail");

            // Generate a random location.
            let start = SystemTime::now();
            let since_the_epoch = start
                .duration_since(UNIX_EPOCH)
                .expect("Time went backwards");
            let mut rng = oorandom::Rand64::new(since_the_epoch.as_millis());

            let x = rng.rand_float() * 500.0 + 250.0;
            let y = rng.rand_float() * 500.0 + 250.0;

            /* Create new entity. */
            let mut body = Polygon::new(vec![
                Vec2f::new(0.0, 0.0),
                Vec2f::new(50.0, 0.0),
                Vec2f::new(50.0, 50.0),
                Vec2f::new(0.0, 50.0),
            ]);
            body.translate((x, y).into());
            let color = color_from_string_hash(&client.name);

            let id = Id::random();

            let entity = world
                .create_entity()
                .with(id)
                .with(Pos(body.centroid()))
                .with(Mass(500.0))
                .with(Vel((0.0, 0.0).into()))
                .with(Owner(client.uuid))
                .with(Shape(body.clone()))
                .with(Rgb(color.0, color.1, color.2))
                .build();

            let mut gravity = world.write_resource::<GravityList>();
            let mut colliders = world.write_resource::<ColliderList>();
            for other_entity in entities_to_bind {
                gravity
                    .0
                    .push(GravityPair::new(6.673e3, entity, other_entity));
                colliders
                    .0
                    .push(ColliderPair::new(1.0, entity, other_entity));
            }

            tx.send(Message::text(
                serde_json::to_string(&Payload::Message {
                    origin: None,
                    target: GROUP_TARGET,
                    data: PhysicsPayload::EntityNew {
                        entity: EntityDump {
                            id: id.0,
                            polygon: body,
                            color: (color.0, color.1, color.2),
                        },
                    },
                })
                .unwrap(),
            ))
            .unwrap();
        }
        PhysicsPayload::FetchEntities => {
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
                    target: Target::ServiceClientUuid { name: crate::PHYSICS_ENGINE_GROUP, uuid: client.uuid },
                    data: PhysicsPayload::EntityDump {
                        entities: entities.clone(),
                    },
                })
                .unwrap(),
            ));
        }
        PhysicsPayload::ToggleColor { id } => {
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
        PhysicsPayload::TouchEntity { id } => {
            let mut world = world.write().await;
            let entities = world.entities();
            let ids = world.read_component::<Id>();

            let touched_entity = (&entities, &ids)
                .par_join()
                .find_first(|(_, Id(iid))| iid == &id)
                .map(|(e, _)| e.clone());

            drop(ids);

            if let Some(touched_entity) = touched_entity {
                let owners = world.read_component::<Owner>();
                if owners
                    .get(touched_entity)
                    .map(|owner| owner.0 != client.uuid)
                    .unwrap_or(true)
                {
                    drop(owners);
                    entities.delete(touched_entity).expect("Delete fail");

                    let mut list = world.write_resource::<ColliderList>();
                    list.0.retain(|pair| {
                        pair.entity.0 != touched_entity && pair.entity.1 != touched_entity
                    });

                    let mut list = world.write_resource::<GravityList>();
                    list.0.retain(|pair| {
                        pair.entity.0 != touched_entity && pair.entity.1 != touched_entity
                    });

                    tx.send(Message::text(
                        serde_json::to_string(&Payload::Message {
                            origin: None,
                            target: GROUP_TARGET,
                            data: PhysicsPayload::EntityDelete { ids: vec![id] },
                        })
                        .unwrap(),
                    ))
                    .unwrap();
                } else {
                    drop(owners);

                    let shapes = world.read_component::<Shape>();
                    let poss = world.read_component::<Pos>();
                    let masss = world.read_component::<Mass>();
                    let colors = world.read_component::<Rgb>();

                    let mut joiner = (&shapes, &poss, &masss, &colors).join();

                    if let Some((shape, &pos, &mass, &rgb)) = joiner.get(touched_entity, &entities)
                    {
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
                            .with(Owner(client.uuid))
                            .with(shape.clone())
                            .with(rgb)
                            .build();

                        let mut gravity = world.write_resource::<GravityList>();
                        let mut colliders = world.write_resource::<ColliderList>();
                        for other_entity in entities_to_bind {
                            gravity
                                .0
                                .push(GravityPair::new(6.673e3, entity, other_entity));
                            colliders
                                .0
                                .push(ColliderPair::new(1.0, entity, other_entity));
                        }

                        tx.send(Message::text(
                            serde_json::to_string(&Payload::Message {
                                origin: None,
                                target: GROUP_TARGET,
                                data: PhysicsPayload::EntityNew {
                                    entity: EntityDump {
                                        id: id.0,
                                        polygon: shape.0,
                                        color: (rgb.0, rgb.1, rgb.2),
                                    },
                                },
                            })
                            .unwrap(),
                        ))
                        .unwrap();
                    }
                }
            }
        }
        _ => {}
    }
}
