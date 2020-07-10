// mod concierge_api;
mod physics_payload;
mod server;

pub const PHYSICS_ENGINE_NAME: &str = "physics_engine";
pub const PHYSICS_ENGINE_GROUP: &str = "physics_engine_out";

pub use server::init_systems;