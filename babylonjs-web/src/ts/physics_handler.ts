import * as ConciergeAPI from "./concierge_api";
import { DeepImmutable, Vector2, DeepImmutableArray, Color3, ExecuteCodeAction } from "babylonjs";
import { Renderer, Shape } from "./renderer";

export interface Vec2f {
    x: number,
    y: number
}

type RgbColor = [number, number, number];

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

export interface PositionDump {
    type: "POSITION_DUMP"
    updates: EntityUpdate[]
}

type PhysicsPayload = EntityDump | PositionDump
    | FetchEntities | FetchPositions
    | ColorUpdate | ToggleColor;

export const PHYSICS_ENGINE_NAME = "physics_engine";
export const PHYSICS_ENGINE_GROUP = "physics_engine_out";

function vec2f2vector2(vec: Vec2f): Vector2 {
    return new Vector2(vec.x, vec.y);
}

function tuple2color3(tuple: DeepImmutable<RgbColor>): Color3 {
    function clamp(n: number): number {
        return Math.max(0, Math.min(n, 255)) / 255
    }

    return new Color3(clamp(tuple[0]), clamp(tuple[1]), clamp(tuple[2]))
}

export class PhysicsHandler extends ConciergeAPI.ServiceEventHandler {
    readonly renderer: Renderer;
    readonly client: ConciergeAPI.Client;

    private shapes: Map<string, Shape>;

    constructor(client: ConciergeAPI.Client, renderer: Renderer) {
        super(client, PHYSICS_ENGINE_GROUP);
        this.client = client;
        this.renderer = renderer;
        this.shapes = new Map();
    }

    onRecvMessage(message: ConciergeAPI.Payloads.Message<any>) {
        if (message.origin!.name != PHYSICS_ENGINE_NAME) {
            return;
        }
        this.processPhysicsPayload(message.data as PhysicsPayload);
    }

    onSubscribe() {
        console.log("Fetching...")
        this.client.sendJSON({
            type: "MESSAGE",
            target: {
                type: "NAME",
                name: PHYSICS_ENGINE_NAME
            },
            data: {
                type: "FETCH_ENTITIES"
            }
        });
    }

    onUnsubscribe() {
        this.clearShapes();
    }

    clearShapes() {
        for (let key of this.shapes.keys()) {
            if (this.shapes.has(key)) {
                let shape = this.shapes.get(key)!;
                this.renderer.generator?.removeShadowCaster(shape.mesh);
                shape.mesh.dispose();
                this.shapes.delete(key);
            }
        }
    }

    createPolygon(id: string, centroid: Vector2, points: Vector2[], color: Color3, scale: number = 1): Shape {
        if (this.renderer.scene) {
            let shape = Shape.createPolygon(id, centroid, points, this.renderer.scene, color, scale);
            this.shapes.set(id, shape);
            this.renderer.generator?.addShadowCaster(shape.mesh);
            return shape;
        }
        throw new Error("Scene not initialized!")
    }

    private createShape(id: string, centroid: Vec2f, points: DeepImmutableArray<Vec2f>, color: DeepImmutable<RgbColor>, scale: number = 1) {
        let centroidv = vec2f2vector2(centroid);
        let pointsv = points.map(vec2f2vector2);
        let color3 = tuple2color3(color);
        let shape = this.createPolygon(id, centroidv, pointsv, color3, scale);
        shape.mesh.actionManager!.registerAction(
            new ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    console.log("Clicking on object ", id, ".")
                    this.client.sendJSON({
                        type: "MESSAGE",
                        target: {
                            type: "NAME",
                            name: PHYSICS_ENGINE_NAME
                        },
                        data: {
                            type: "TOGGLE_COLOR",
                            id: id,
                        }
                    })
                }
            )
        );
    }

    private updateShape(id: string, centroid: Vec2f) {
        let shape = this.shapes.get(id);
        if (shape) {
            shape.moveTo(vec2f2vector2(centroid));
        } 
        
    }

    private updateColor(id: string, color: DeepImmutable<RgbColor>) {
        let shape = this.shapes.get(id);
        if (shape) {
            shape.setColor(tuple2color3(color));
        } 
        
    }

    private processPhysicsPayload(payload: DeepImmutable<PhysicsPayload>) {
        switch (payload.type) {
            case "ENTITY_DUMP":
                console.log("Dumping entities!");
                this.clearShapes();
                for (let entity of payload.entities) {
                    this.createShape(entity.id, entity.centroid, entity.points, entity.color);
                }
                break;
            case "POSITION_DUMP":
                for (let update of payload.updates) {
                    this.updateShape(update.id, update.position);
                }
                break;
            case "COLOR_UPDATE":
                this.updateColor(payload.id, payload.color);
                break;
            default:
                console.log(payload);
                break;
        }
    }
}