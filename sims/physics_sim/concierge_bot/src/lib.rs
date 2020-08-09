// mod concierge_api;
mod physics_payload;
mod service;

pub const CLIENT_NAME: &str = "physics_engine";
pub const CLIENT_NICKNAME: &str = "Physics Engine Client";
pub const SERVICE_NAME: &str = "physics_engine";
pub const SERVICE_NICKNAME: &str = "Rust Physics Game";

pub use service::init_bot;