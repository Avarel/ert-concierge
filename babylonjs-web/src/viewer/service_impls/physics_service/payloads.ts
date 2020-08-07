export interface Vec2f {
    x: number,
    y: number
}

export type RgbColor = [number, number, number];

namespace PhysicsPayloads {
    export interface Entity {
        id: string,
        centroid: Vec2f,
        points: Vec2f[],
        color: RgbColor
    }

    export interface ToggleColor {
        type: "TOGGLE_COLOR",
        id: string,
    }

    export interface ColorUpdate {
        type: "COLOR_UPDATE",
        id: string,
        color: RgbColor
    }

    export interface EntityUpdate {
        id: string,
        position: Vec2f,
    }

    export interface FetchEntities {
        type: "FETCH_ENTITIES"
    }

    export interface FetchPositions {
        type: "FETCH_POSITIONS"
    }

    export interface EntityDump {
        type: "ENTITY_DUMP",
        entities: Entity[]
    }

    export interface EntityNew {
        type: "ENTITY_NEW",
        entity: Entity
    }

    export interface EntityDelete {
        type: "ENTITY_DELETE",
        ids: string[],
    }

    export interface PositionDump {
        type: "POSITION_DUMP"
        updates: EntityUpdate[]
    }

    export interface TouchEntity {
        type: "TOUCH_ENTITY",
        id: string,
    }

    export interface SpawnEntity {
        type: "SPAWN_ENTITY"
    }

    export type Payload = EntityDump | PositionDump
        | FetchEntities | FetchPositions
        | ColorUpdate | ToggleColor | TouchEntity | EntityNew | EntityDelete | SpawnEntity;
}
export type PhysicsPayload = PhysicsPayloads.Payload;