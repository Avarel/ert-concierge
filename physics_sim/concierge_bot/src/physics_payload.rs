use concierge_api_rs::payload::Payload as ConciergePayload;
use cs3_physics::{polygon::Polygon, vector::Vec2f};
use serde::{Deserialize, Serialize};

pub type Payload<'a> = ConciergePayload<'a, PhysicsPayload<'a>>;

type RgbColor = (u8, u8, u8);

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EntityDump {
    pub id: String,
    #[serde(flatten)]
    pub polygon: Polygon,
    pub color: RgbColor,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EntityUpdate {
    pub id: String,
    pub position: Vec2f,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PhysicsPayload<'a> {
    FetchEntities,
    FetchPositions,
    ToggleColor { id: &'a str },
    EntityDump { entities: Vec<EntityDump> },
    PositionDump { updates: Vec<EntityUpdate> },
    ColorUpdate { id: &'a str, color: RgbColor },
}
