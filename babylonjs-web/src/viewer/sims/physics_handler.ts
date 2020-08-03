import * as ConciergeAPI from "../../concierge_api/mod";
import { DeepImmutable, Vector2, DeepImmutableArray, Color3, ExecuteCodeAction, Vector3, DeepImmutableObject, Scene, PolygonMeshBuilder, StandardMaterial, ActionManager, MeshBuilder, Mesh } from "babylonjs";
import { RendererView } from "../renderer";
import { ServiceEventHandler } from "../../concierge_api/handlers";
import { Payload } from "../../concierge_api/payloads";

interface Vec2f {
    x: number,
    y: number
}

type RgbColor = [number, number, number];

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
        id: string,
    }

    export interface PositionDump {
        type: "POSITION_DUMP"
        updates: EntityUpdate[]
    }

    export interface TouchEntity {
        type: "TOUCH_ENTITY",
        id: string,
    }

    export type Payload = EntityDump | PositionDump
        | FetchEntities | FetchPositions
        | ColorUpdate | ToggleColor | TouchEntity | EntityNew | EntityDelete;
}
type PhysicsPayload = PhysicsPayloads.Payload;

export const PHYSICS_ENGINE_NAME = "physics_engine";
export const PHYSICS_ENGINE_GROUP = "physics_engine_out";

function vec2f2vector2(vec: Vec2f): Vector2 {
    return new Vector2(vec.x - 500, vec.y - 500);
}

function tuple2color3(tuple: DeepImmutable<RgbColor>): Color3 {
    function clamp(n: number): number {
        return Math.max(0, Math.min(n, 255)) / 255
    }

    return new Color3(clamp(tuple[0]), clamp(tuple[1]), clamp(tuple[2]))
}

class PolygonShape {
    centroid: Vector3;
    mesh: Mesh;

    private constructor(centroid: Vector3, mesh: Mesh) {
        this.centroid = centroid;
        this.mesh = mesh;
    }

    static createPolygon(centroid: Vector3, points: Vector2[], scene: Scene, color: Color3, scale: number = 1): PolygonShape {
        let corners = points.map((v) => v.scaleInPlace(scale));
        let poly_tri = new PolygonMeshBuilder("polytri", corners, scene);
        let mesh = poly_tri.build(undefined, 50 * scale);
        mesh.position.y += 50 * scale;

        var mat = new StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new ActionManager(scene);

        return new PolygonShape(centroid.scaleInPlace(scale), mesh);
    }

    setColor(color: DeepImmutableObject<Color3>) {
        (this.mesh.material! as StandardMaterial).diffuseColor! = color;
    }

    moveTo(point: DeepImmutableObject<Vector3>) {
        let translate = point.subtract(this.centroid);

        this.mesh.position.addInPlace(translate);
        this.centroid.set(point.x, point.y, point.z);
    }

    dispose() {
        this.mesh.dispose();
    }
}

export class PhysicsHandler extends ServiceEventHandler {
    private shapes: Map<string, PolygonShape> = new Map();
    private readonly visualScale: number = 1 / 50;

    constructor(
        client: ConciergeAPI.Client,
        private readonly renderer: RendererView
    ) {
        super(client, PHYSICS_ENGINE_GROUP);
    }

    sendToSim(data: PhysicsPayload) {
        this.client.sendJSON({
            type: "MESSAGE",
            target: {
                type: "NAME",
                name: PHYSICS_ENGINE_NAME
            },
            data
        });
    }

    onRecvMessage(message: Payload.Message<PhysicsPayload>) {
        if (message.origin!.name != PHYSICS_ENGINE_NAME) {
            return;
        }
        this.processPhysicsPayload(message.data);
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
                // this.renderer.shadowGenerator?.removeShadowCaster(shape.mesh);
                shape.dispose();
                this.shapes.delete(key);
            }
        }
    }

    createPolygon(id: string, centroid: Vector2, points: Vector2[], color: Color3): PolygonShape {
        if (this.renderer.scene) {
            let shape = PolygonShape.createPolygon(new Vector3(centroid.x, 0, centroid.y), points, this.renderer.scene, color, this.visualScale);
            this.shapes.set(id, shape);
            // this.renderer.shadowGenerator?.addShadowCaster(shape.mesh);
            return shape;
        }
        throw new Error("Scene not initialized!")
    }

    private createShape(id: string, centroid: Vec2f, points: DeepImmutableArray<Vec2f>, color: DeepImmutable<RgbColor>) {
        let centroidv = vec2f2vector2(centroid);
        let pointsv = points.map(vec2f2vector2);
        let color3 = tuple2color3(color);
        let shape = this.createPolygon(id, centroidv, pointsv, color3);
        shape.mesh.actionManager!.registerAction(
            new ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    console.log("Clicking on object ", id, ".")
                    this.sendToSim({
                        type: "TOUCH_ENTITY",
                        id: id,
                    });
                }
            )
        );
    }

    private removeShape(id: string) {
        let shape = this.shapes.get(id);
        if (shape) {
            shape.dispose();
            this.shapes.delete(id);
        }
    }

    private updateShape(id: string, centroid: Vec2f) {
        let shape = this.shapes.get(id);
        if (shape) {
            let vector2 = vec2f2vector2(centroid);
            shape.moveTo(new Vector3(vector2.x, 0, vector2.y).scaleInPlace(this.visualScale));
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
            case "ENTITY_NEW":
                let entity = payload.entity;
                this.createShape(entity.id, entity.centroid, entity.points, entity.color);
                break;
            case "ENTITY_DELETE":
                this.removeShape(payload.id);
                break;
            case "ENTITY_DUMP":
                // console.log("RECV", JSON.stringify(payload));
                console.log("Dumping entities!");
                this.clearShapes();
                for (let entity of payload.entities) {
                    this.createShape(entity.id, entity.centroid, entity.points, entity.color);
                }
                break;
            case "POSITION_DUMP":
                // console.log("RECV", JSON.stringify(payload));
                for (let update of payload.updates) {
                    this.updateShape(update.id, update.position);
                }
                break;
            case "COLOR_UPDATE":
                // console.log("RECV", JSON.stringify(payload));
                this.updateColor(payload.id, payload.color);
                break;
            default:
                // console.log("RECV", JSON.stringify(payload));
                break;
        }
    }
}