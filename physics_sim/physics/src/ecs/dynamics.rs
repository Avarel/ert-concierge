use super::{kinetics::*, DeltaTime};
use specs::prelude::*;
use specs::Component;

#[derive(Component)]
#[storage(VecStorage)]
pub struct Mass(pub f64);

// pub struct GravityPair {
//     pub gravity: f64,
//     pub entity: (Entity, Entity)
// }

// impl GravityPair {
//     pub fn new(gravity: f64, entity0: Entity, entity1: Entity) -> Self {
//         Self {
//             gravity,
//             entity: (entity0, entity1)
//         }
//     }
// }

pub struct GravitySys(pub f64, pub Vec<(Entity, Entity)>);
impl<'a> System<'a> for GravitySys {
    type SystemData = (
        Entities<'a>,
        ReadExpect<'a, DeltaTime>,
        WriteStorage<'a, Vel>,
        ReadStorage<'a, Pos>,
        ReadStorage<'a, Mass>,
    );

    fn run(&mut self, (entities, delta, mut vel, pos, mass): Self::SystemData) {
        let dt = delta.0.as_secs_f64();

        let gravity_constant = self.0;

        let mut joiner = (&mut vel, &pos, &mass).join();

        for &(entity1, entity2) in &self.1 {
            if entity1 == entity2 {
                panic!("Warning! Two entities in gravity pair are the same!");
            }

            let (Vel(vel1), &Pos(pos1), _) = joiner.get(entity1, &entities).unwrap();
            let (Vel(vel2), &Pos(pos2), &Mass(mass2)) = joiner.get(entity2, &entities).unwrap();

            let rv = pos2 - pos1;
            let r = rv.norm();
            if r > 1.0 {
                let g = gravity_constant * mass2 / r.powi(2);
                let gv = g * rv.normalize(); // gravity vector
                let impulse = gv * dt;
                *vel1 += impulse;
                *vel2 -= impulse;
            }
        }
    }
}
