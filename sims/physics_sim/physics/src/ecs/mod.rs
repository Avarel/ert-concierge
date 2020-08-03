pub mod colliders;
pub mod dynamics;
pub mod kinetics;

use specs::prelude::*;
use specs::Component;
use std::time::Duration;
use uuid::Uuid;

pub struct DeltaTime(pub Duration);

#[derive(Component, Copy, Clone)]
#[storage(VecStorage)]
pub struct Rgb(pub u8, pub u8, pub u8);

#[derive(Component, Copy, Clone)]
#[storage(VecStorage)]
pub struct Id(pub Uuid);

#[derive(Component, Copy, Clone)]
#[storage(VecStorage)]
pub struct Owner(pub Uuid);

impl Id {
    pub fn random() -> Self {
        Self(Uuid::new_v4())
    }
}