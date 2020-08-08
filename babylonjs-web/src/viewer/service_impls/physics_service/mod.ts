import Client, { Payload, ServiceEventHandler } from "../../../concierge_api/mod";
import { Vector2, Color3, ExecuteCodeAction, Vector3, Scene, PolygonMeshBuilder, StandardMaterial, ActionManager, Mesh } from "babylonjs";
import { RendererView } from "../../renderer";
import { Vec2f, RgbColor, PhysicsPayload } from "./payloads";
import { PhysicsComponent } from "./components";
import React from "react";
import { Tabbed } from "../../../overlay/mod";

function vec2f2vector2(vec: Readonly<Vec2f>): Vector2 {
    return new Vector2(vec.x - 500, vec.y - 500);
}

function tuple2color3(tuple: Readonly<RgbColor>): Color3 {
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
        const corners = points.map((v) => v.scaleInPlace(scale));
        const poly_tri = new PolygonMeshBuilder("polytri", corners, scene);
        const mesh = poly_tri.build(undefined, 50 * scale);
        mesh.position.y += 50 * scale;

        var mat = new StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new ActionManager(scene);

        return new PolygonShape(centroid.scaleInPlace(scale), mesh);
    }

    setColor(color: Readonly<Color3>) {
        (this.mesh.material! as StandardMaterial).diffuseColor! = color;
    }

    moveTo(point: Readonly<Vector3>) {
        const translate = point.subtract(this.centroid);

        this.mesh.position.addInPlace(translate);
        this.centroid.set(point.x, point.y, point.z);
    }

    dispose() {
        this.mesh.dispose();
    }
}

export class RustPhysicsService extends ServiceEventHandler {
    private static readonly NAME = "physics_engine";
    private static readonly GROUP = "physics_engine_out";

    private shapes: Map<string, PolygonShape> = new Map();
    private readonly visualScale: number = 1 / 50;
    private tab: Tabbed.Tab | undefined;

    constructor(
        client: Client,
        private readonly renderer: RendererView,
        private tabbedComponent?: Tabbed.Instance
    ) {
        super(client, RustPhysicsService.GROUP);
    }

    sendToSim(data: Readonly<PhysicsPayload>) {
        this.client.sendPayload({
            type: "MESSAGE",
            target: {
                type: "NAME",
                name: RustPhysicsService.NAME
            },
            data
        });
    }

    onReceive(payload: Readonly<Payload.Any<any>>) {
        if (payload.type == "MESSAGE") {
            if (payload.origin!.name != RustPhysicsService.NAME) {
                return;
            }
            this.processPhysicsPayload(payload.data);
        } else {
            super.onReceive(payload);
        }
    }

    onSubscribe() {
        console.log("Fetching...")
        this.sendToSim({
            type: "FETCH_ENTITIES"
        });
        this.sendToSim({
            type: "SPAWN_ENTITY"
        });
        this.tab = this.tabbedComponent?.addTab(RustPhysicsService.NAME, "Rust Physics");

        this.renderTab();
    }

    renderTab() {
        if (this.tab) {
            this.tab.reactContent = React.createElement(PhysicsComponent, { handler: this });
        }
    }

    onUnsubscribe() {
        this.clearShapes();
        this.destroyTab();
    }

    destroyTab() {
        this.tabbedComponent?.removeTab(RustPhysicsService.NAME);
    }

    clearShapes() {
        for (const shape of this.shapes.values()) {
            shape.dispose();
        }
        this.shapes.clear();
    }

    createPolygon(id: string, centroid: Vector2, points: Vector2[], color: Color3): PolygonShape {
        if (this.renderer.scene) {
            let shape = PolygonShape.createPolygon(new Vector3(centroid.x, 0, centroid.y), points, this.renderer.scene, color, this.visualScale);
            this.shapes.set(id, shape);
            return shape;
        }
        throw new Error("Scene not initialized!")
    }

    private createShape(id: string, centroid: Vec2f, points: ReadonlyArray<Vec2f>, color: Readonly<RgbColor>) {
        const centroidv = vec2f2vector2(centroid);
        const pointsv = points.map(vec2f2vector2);
        const color3 = tuple2color3(color);
        const shape = this.createPolygon(id, centroidv, pointsv, color3);
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
        const shape = this.shapes.get(id);
        if (shape) {
            shape.dispose();
            this.shapes.delete(id);
        }
    }

    private updateShape(id: string, centroid: Vec2f) {
        const shape = this.shapes.get(id);
        if (shape) {
            const vector2 = vec2f2vector2(centroid);
            shape.moveTo(new Vector3(vector2.x, 0, vector2.y).scaleInPlace(this.visualScale));
        }
    }

    private updateColor(id: string, color: Readonly<RgbColor>) {
        const shape = this.shapes.get(id);
        if (shape) {
            shape.setColor(tuple2color3(color));
        }
    }

    private processPhysicsPayload(payload: Readonly<PhysicsPayload>) {
        switch (payload.type) {
            case "ENTITY_NEW":
                const entity = payload.entity;
                this.createShape(entity.id, entity.centroid, entity.points, entity.color);
                break;
            case "ENTITY_DELETE":
                for (const id of payload.ids) {
                    this.removeShape(id);
                }
                break;
            case "ENTITY_DUMP":
                // console.log("RECV", JSON.stringify(payload));
                console.log("Dumping entities!");
                this.clearShapes();
                for (const entity of payload.entities) {
                    this.createShape(entity.id, entity.centroid, entity.points, entity.color);
                }
                break;
            case "POSITION_DUMP":
                // console.log("RECV", JSON.stringify(payload));
                for (const update of payload.updates) {
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