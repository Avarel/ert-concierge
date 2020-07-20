use super::{dynamics::Mass, kinetics::*, DeltaTime};
use crate::polygon::Polygon;
use specs::prelude::*;
use specs::Component;

#[derive(Component)]
pub struct Shape(pub Polygon);

pub struct ShapeKineticSys;
impl<'a> System<'a> for ShapeKineticSys {
    type SystemData = (
        ReadExpect<'a, DeltaTime>,
        WriteStorage<'a, Shape>,
        ReadStorage<'a, Pos>,
        ReadStorage<'a, Vel>,
        ReadStorage<'a, Omega>,
    );

    fn run(&mut self, (delta, mut shape, pos, vel, omega): Self::SystemData) {
        let dt = delta.0.as_secs_f64();
        (&mut shape, &vel)
            .par_join()
            .for_each(|(Shape(polygon), &Vel(vel))| {
                polygon.translate(vel * dt);
            });
        (&mut shape, &pos, &omega).par_join().for_each(
            |(Shape(polygon), &Pos(pos), &Omega(omega))| {
                polygon.rotate_relative(omega * dt, pos);
            },
        );
    }
}

pub struct ColliderPair {
    pub elasticity: f64,
    pub entity: (Entity, Entity)
}

impl ColliderPair {
    pub fn new(elasticity: f64, entity0: Entity, entity1: Entity) -> Self {
        Self {
            elasticity,
            entity: (entity0, entity1)
        }
    }
}

pub struct PhysicalColliderSys(pub Vec<ColliderPair>);
impl<'a> System<'a> for PhysicalColliderSys {
    type SystemData = (
        Entities<'a>,
        WriteStorage<'a, Pos>,
        WriteStorage<'a, Vel>,
        WriteStorage<'a, Shape>,
        ReadStorage<'a, Mass>,
    );

    fn run(&mut self, (entities, mut pos, mut vel, mut shape, mass): Self::SystemData) {
        let mut joiner = (&mut shape, &mut pos, &mut vel, &mass).join();
        
        for &ColliderPair { elasticity, entity } in &self.0 {
            if entity.0 == entity.1 {
                panic!("Warning! Two entities in physical collider pair are the same!");
            }

            // will be unsafe in the future, but for now no.
            // made sure that the entities are not equal to each other
            // so that we are not mutably aliasing the same contents
            let (Shape(poly1), Pos(pos1), Vel(vel1), &Mass(mass1)) =
                joiner.get(entity.0, &entities).unwrap();
            let (Shape(poly2), Pos(pos2), Vel(vel2), &Mass(mass2)) =
                joiner.get(entity.1, &entities).unwrap();

            if let Some(axis) = crate::collision::find_collision(poly1, poly2) {
                let (reduced_mass, mass_ratio) = match (!mass1.is_normal(), !mass2.is_normal()) {
                    (true, true) => (0.0, 0.0),
                    (false, true) => (mass1, 1.0),
                    (true, false) => (mass2, 0.0),
                    (false, false) => ((mass1 * mass2) / (mass1 + mass2), mass1 / (mass1 + mass2)),
                };

                let norm = axis.normalize();
                let ub = vel2.dot(norm);
                let ua = vel1.dot(norm);
                let factor = reduced_mass * (1.0 + elasticity) * (ub - ua);
                let impulse = factor * norm;

                // MTV resolution
                poly1.translate(-axis * mass_ratio);
                *pos1 -= axis * mass_ratio;

                poly2.translate(axis * (1.0 - mass_ratio));
                *pos2 += axis * (1.0 - mass_ratio);

                // Velocity resolution
                *vel1 += impulse / mass1;
                *vel2 -= impulse / mass2;
            }
        }
    }
}