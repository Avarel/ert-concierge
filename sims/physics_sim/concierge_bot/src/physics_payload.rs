use concierge_api_rs::payload::Payload as ConciergePayload;
use cs3_physics::{polygon::Polygon, vector::Vec2f};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::marker::PhantomData;

pub type Payload<'a> = ConciergePayload<'a, PhysicsPayload<'a>>;

type RgbColor = (u8, u8, u8);

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EntityDump {
    pub id: Uuid,
    #[serde(flatten)]
    pub polygon: Polygon,
    pub color: RgbColor,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EntityUpdate {
    pub id: Uuid,
    pub position: Vec2f,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PhysicsPayload<'a> {
    FetchEntities,
    FetchPositions,
    ToggleColor { id: Uuid },
    TouchEntity { id: Uuid },
    EntityDump { entities: Vec<EntityDump> },
    EntityNew { entity: EntityDump },
    EntityDelete { id: Uuid },
    PositionDump { updates: Vec<EntityUpdate> },
    ColorUpdate { id: Uuid, color: RgbColor },
    Reserved {
        _phantom: PhantomData<&'a ()>
    }
}
