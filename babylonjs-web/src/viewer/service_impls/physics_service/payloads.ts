export interface Vec2f {
    x: number,
    y: number
}

export type RgbColor = [number, number, number];

namespace PhysicsPayloads {
    export interface Entity {
        readonly id: string,
        readonly centroid: Vec2f,
        readonly points: Vec2f[],
        readonly color: Readonly<RgbColor>
    }

    export interface ToggleColor {
        readonly type: "TOGGLE_COLOR",
        readonly id: string,
    }

    export interface ColorUpdate {
        readonly type: "COLOR_UPDATE",
        readonly id: string,
        readonly color: Readonly<RgbColor>
    }

    export interface EntityUpdate {
        readonly id: string,
        readonly position: Readonly<Vec2f>,
    }

    export interface FetchEntities {
        readonly type: "FETCH_ENTITIES"
    }

    export interface FetchPositions {
        readonly type: "FETCH_POSITIONS"
    }

    export interface EntityDump {
        readonly type: "ENTITY_DUMP",
        readonly entities: ReadonlyArray<Entity>
    }

    export interface EntityNew {
        readonly type: "ENTITY_NEW",
        readonly entity: Entity
    }

    export interface EntityDelete {
        readonly type: "ENTITY_DELETE",
        readonly ids: ReadonlyArray<string>,
    }

    export interface PositionDump {
        readonly type: "POSITION_DUMP"
        readonly updates: ReadonlyArray<EntityUpdate>
    }

    export interface TouchEntity {
        readonly type: "TOUCH_ENTITY",
        readonly id: string,
    }

    export interface SpawnEntity {
        readonly type: "SPAWN_ENTITY"
    }

    export type Payload = EntityDump | PositionDump
        | FetchEntities | FetchPositions
        | ColorUpdate | ToggleColor | TouchEntity | EntityNew | EntityDelete | SpawnEntity;
}
export type PhysicsPayload = PhysicsPayloads.Payload;