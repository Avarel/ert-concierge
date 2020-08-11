use cs3_physics::{
    ecs::{colliders::*, dynamics::*, kinetics::*, *},
    polygon::Polygon,
    specs::prelude::*,
    vector::Vec2f,
};
use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Duration,
};
use tokio::{sync::RwLock, time::delay_for};
use uuid::Uuid;

pub const MS_DT: u64 = 20;
pub const MS_SIM_INTERVAL: u64 = 10;

#[tokio::main]
async fn main() -> Result<(), String> {
    let mut world = World::new();
    world.register::<Id>();
    world.register::<Owner>();

    world.register::<Pos>();
    world.register::<Vel>();

    world.register::<Mass>();
    world.register::<Shape>();

    world.register::<Theta>();
    world.register::<Omega>();

    world.register::<Rgb>();

    world.insert(DeltaTime(Duration::from_millis(MS_DT)));
    let world = Arc::new(RwLock::new(world));

    let running = Arc::new(AtomicBool::new(true));
    let r = running.clone();
    ctrlc::set_handler(move || {
        r.store(false, Ordering::SeqCst);
    })
    .expect("Error setting Ctrl-C handler");

    physics_concierge_bot::init_bot(running.clone(), world.clone())
        .await
        .expect("Concierge bot failed");
    system_loop(running, world).await;

    Ok(())
}

async fn system_loop(running: Arc<AtomicBool>, aworld: Arc<RwLock<World>>) {
    let mut world = aworld.write().await;
    let mut body = Polygon::new(vec![
        Vec2f::new(100.0, 100.0),
        Vec2f::new(150.0, 100.0),
        Vec2f::new(150.0, 150.0),
        Vec2f::new(100.0, 150.0),
    ]);
    body.translate((200.0, 0.0).into());

    let ent1 = world
        .create_entity()
        .with(Id::random())
        .with(Pos(body.centroid()))
        .with(Vel((0.0, 0.0).into()))
        // .with(Acc::default())
        // .with(Omega(3.14))
        .with(Mass(500.0))
        .with(Owner(Uuid::nil()))
        .with(Shape(body.clone()))
        .with(Rgb(0, 255, 0))
        .build();

    body.translate((250.0, 250.0).into());

    let ent2 = world
        .create_entity()
        .with(Id::random())
        .with(Pos(body.centroid()))
        .with(Vel((-50.0, 0.0).into()))
        // .with(Acc::default())
        // .with(Omega(1.57))
        .with(Mass(500.0))
        .with(Owner(Uuid::nil()))
        .with(Shape(body.clone()))
        .with(Rgb(0, 0, 255))
        .build();

    body.translate((250.0, -100.0).into());
    

    let ent3 = world
        .create_entity()
        .with(Id::random())
        .with(Pos(body.centroid()))
        .with(Vel((0.0, 50.0).into()))
        .with(Mass(500.0))
        .with(Owner(Uuid::nil()))
        .with(Shape(body))
        .with(Rgb(255, 0, 0))
        .build();

    world.insert(ColliderList(vec![
        ColliderPair::new(1.0, ent1, ent2),
        ColliderPair::new(1.0, ent1, ent3),
        ColliderPair::new(1.0, ent2, ent3),
    ]));
    
    world.insert(GravityList(vec![
        GravityPair::new(6.673e3, ent1, ent2),
        GravityPair::new(6.673e3, ent1, ent3),
        GravityPair::new(6.673e3, ent2, ent3),
    ]));

    let mut dispatcher = DispatcherBuilder::new()
        .with(TranslationalKinematicSys, "kine", &[])
        .with(RotationalKinematicSys, "rot_kine", &[])
        .with(ShapeKineticSys, "shape_kine", &["kine"])
        .with(
            EdgeDeflectSys {
                min: (0.0, 0.0).into(),
                max: (1000.0, 1000.0).into(),
            },
            "edge_deflect",
            &[],
        )
        .with(
            PhysicalColliderSys,
            "collider",
            &["edge_deflect"],
        )
        .with(
            GravitySys,
            "grav",
            &["edge_deflect"],
        )
        .build();
    drop(world);

    while running.load(Ordering::SeqCst) {
        let mut world = aworld.write().await;
        dispatcher.dispatch(&mut world);
        world.maintain();
        delay_for(Duration::from_millis(MS_SIM_INTERVAL)).await;
    }
}
