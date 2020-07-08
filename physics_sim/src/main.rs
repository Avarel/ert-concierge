mod rendering;

use rendering::{sdl_wrapper::SDLWrapper, render::*, IsDone};
use cs3_physics::{
    ecs::{colliders::*, dynamics::*, kinetics::*, *},
    polygon::Polygon,
    specs::prelude::*,
    vector::{Vec2, Vec2f},
};
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), String> {
    let wrapper = SDLWrapper::init(Vec2::ZERO, Vec2::new(1000.0, 1000.0))?;

    let mut world = World::new();
    world.register::<Id>();
    world.register::<Pos>();
    world.register::<Vel>();
    // world.register::<Acc>();

    world.register::<Mass>();
    world.register::<Shape>();

    world.register::<Theta>();
    world.register::<Omega>();
    // world.register::<Alpha>();

    world.register::<Rgb>();

    let mut body = Polygon::new(vec![
        Vec2f::new(100.0, 100.0),
        Vec2f::new(150.0, 100.0),
        Vec2f::new(150.0, 150.0),
        Vec2f::new(100.0, 150.0),
    ]);
    body.translate((200.0, 0.0).into());

    let ent1 = world
        .create_entity()
        .with(Id(String::from("green")))
        .with(Pos(body.centroid()))
        .with(Vel((0.0, 0.0).into()))
        // .with(Acc::default())
        // .with(Omega(3.14))
        .with(Mass(500.0))
        .with(Shape(body.clone()))
        .with(Rgb(0, 255, 0))
        .build();

    body.translate((250.0, 250.0).into());

    let ent2 = world
        .create_entity()
        .with(Id(String::from("blue")))
        .with(Pos(body.centroid()))
        .with(Vel((-50.0, 0.0).into()))
        // .with(Acc::default())
        // .with(Omega(1.57))
        .with(Mass(500.0))
        .with(Shape(body.clone()))
        .with(Rgb(0, 0, 255))
        .build();

    body.translate((250.0, -100.0).into());

    let ent3 = world
        .create_entity()
        .with(Id(String::from("red")))
        .with(Pos(body.centroid()))
        .with(Vel((0.0, 50.0).into()))
        .with(Mass(500.0))
        .with(Shape(body))
        .with(Rgb(255, 0, 0))
        .build();

    let (eds, cus, pds) = physics_concierge_bot::init_systems();

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
            PhysicalColliderSys(vec![
                ColliderPair::new(1.0, ent1, ent2),
                ColliderPair::new(1.0, ent1, ent3),
                ColliderPair::new(1.0, ent2, ent3),
            ]),
            "collider",
            &["edge_deflect"],
        )
        .with(
            GravitySys(6.673e3, vec![(ent1, ent2), (ent1, ent3), (ent2, ent3)]),
            "grav",
            &["edge_deflect"],
        )
        .with(eds, "eds", &[])
        .with(cus, "cus", &[])
        .with(pds, "pds", &[])
        .with_thread_local(RenderSys(wrapper))
        .build();

    world.insert(DeltaTime(Duration::from_secs(1)));
    world.insert(IsDone(false));

    while !world.read_resource::<IsDone>().0 {
        dispatcher.dispatch(&mut world);
        world.maintain();
    }

    Ok(())
}
