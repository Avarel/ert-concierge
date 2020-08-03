use super::{kinetics::*, DeltaTime};
use specs::prelude::*;
use specs::Component;

#[derive(Component, Copy, Clone)]
#[storage(VecStorage)]
pub struct Mass(pub f64);

#[derive(Default)]
pub struct GravityList(pub Vec<GravityPair>);

pub struct GravityPair {
    pub gravity: f64,
    pub entity: (Entity, Entity)
}

impl GravityPair {
    pub fn new(gravity: f64, entity0: Entity, entity1: Entity) -> Self {
        Self {
            gravity,
            entity: (entity0, entity1)
        }
    }
}

pub struct GravitySys;
impl<'a> System<'a> for GravitySys {
    type SystemData = (
        Read<'a, GravityList>,
        Entities<'a>,
        ReadExpect<'a, DeltaTime>,
        WriteStorage<'a, Vel>,
        ReadStorage<'a, Pos>,
        ReadStorage<'a, Mass>,
    );

    fn run(&mut self, (list, entities, delta, mut vel, pos, mass): Self::SystemData) {
        let dt = delta.0.as_secs_f64();

        let mut joiner = (&mut vel, &pos, &mass).join();

        for GravityPair { gravity, entity: (entity1, entity2)} in &list.0 {
            if entity1 == entity2 {
                panic!("Warning! Two entities in gravity pair are the same!");
            }

            if let Some((Vel(vel1), &Pos(pos1), _)) = joiner.get(*entity1, &entities) {
                if let Some((Vel(vel2), &Pos(pos2), &Mass(mass2))) = joiner.get(*entity2, &entities) {
                    let rv = pos2 - pos1;
                    let r = rv.norm();
                    if r > 1.0 {
                        let g = gravity* mass2 / r.powi(2);
                        let gv = g * rv.normalize(); // gravity vector
                        let impulse = gv * dt;
                        *vel1 += impulse;
                        *vel2 -= impulse;
                    }
                }
            }
        }
    }
}
