// mod concierge_api;
mod physics_payload;
mod service;

pub const PHYSICS_ENGINE_NAME: &str = "physics_engine";
pub const PHYSICS_ENGINE_GROUP: &str = "physics_engine_out";

pub use service::init_bot;