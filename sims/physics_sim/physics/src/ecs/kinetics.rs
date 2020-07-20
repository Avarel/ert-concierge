use super::DeltaTime;
use crate::vector::Vec2f;
use specs::prelude::*;
use specs::Component;

#[derive(Component)]
#[storage(VecStorage)]
pub struct Pos(pub Vec2f);

#[derive(Component, Default)]
#[storage(VecStorage)]
pub struct Vel(pub Vec2f);

#[derive(Component)]
#[storage(VecStorage)]
pub struct Theta(pub f64);

#[derive(Component)]
#[storage(VecStorage)]
pub struct Omega(pub f64);

pub struct TranslationalKinematicSys;
impl<'a> System<'a> for TranslationalKinematicSys {
    type SystemData = (
        ReadExpect<'a, DeltaTime>,
        WriteStorage<'a, Pos>,
        ReadStorage<'a, Vel>,
    );

    fn run(&mut self, (delta, mut pos, vel): Self::SystemData) {
        let dt = delta.0.as_secs_f64();

        (&mut pos, &vel)
            .par_join()
            .for_each(|(Pos(pos), &Vel(vel))| {
                *pos += vel * dt;
            });
    }
}

pub struct RotationalKinematicSys;
impl<'a> System<'a> for RotationalKinematicSys {
    type SystemData = (
        ReadExpect<'a, DeltaTime>,
        WriteStorage<'a, Theta>,
        ReadStorage<'a, Omega>,
    );

    fn run(&mut self, (delta, mut theta, omega): Self::SystemData) {
        let dt = delta.0.as_secs_f64();

        (&mut theta, &omega)
            .par_join()
            .for_each(|(Theta(theta), &Omega(omega))| {
                *theta += omega * dt;
            });
    }
}

pub struct EdgeDeflectSys {
    pub min: Vec2f,
    pub max: Vec2f,
}

impl<'a> System<'a> for EdgeDeflectSys {
    type SystemData = (WriteStorage<'a, Vel>, ReadStorage<'a, Pos>);

    fn run(&mut self, (mut vel, pos): Self::SystemData) {
        (&mut vel, &pos)
            .par_join()
            .for_each(|(Vel(vel), &Pos(pos))| {
                if (pos.x < self.min.x && vel.x < 0.0) || (pos.x > self.max.x && vel.x > 0.0) {
                    vel.x *= -1.0;
                } else if (pos.y < self.min.y && vel.y < 0.0) || (pos.y > self.max.y && vel.y > 0.0)
                {
                    vel.y *= -1.0;
                }
            });
    }
}