pub mod colliders;
pub mod dynamics;
pub mod kinetics;

use specs::prelude::*;
use specs::Component;
use std::time::Duration;

pub struct DeltaTime(pub Duration);

#[derive(Component)]
#[storage(VecStorage)]
pub struct Rgb(pub u8, pub u8, pub u8);

#[derive(Component)]
#[storage(DenseVecStorage)]
pub struct Id(pub String);
