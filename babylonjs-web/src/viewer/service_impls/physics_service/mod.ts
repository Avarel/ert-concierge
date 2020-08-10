import Client, { ServiceEventHandler } from "../../../concierge_api/mod";
import { Vector2, Color3, ExecuteCodeAction, Vector3, Scene, PolygonMeshBuilder, StandardMaterial, ActionManager, Mesh } from "babylonjs";
import { RendererView } from "../../renderer";
import { Vec2f, RgbColor, PhysicsPayload } from "./payloads";
import { PhysicsComponent as PhysicsControllerComponent } from "./components";
import React from "react";
import { Tabbed } from "../../../overlay/mod";
import { PolygonObject } from "./objects";
import { tuple2color3, vec2f2vector2 } from "./utils";

export class RustPhysicsService extends ServiceEventHandler<PhysicsPayload> {
    private shapes: Map<string, PolygonObject> = new Map();
    private readonly visualScale: number = 1 / 50;
    private tab: Tabbed.Tab | undefined;

    constructor(
        client: Client,
        private readonly renderer: RendererView,
        private tabbedComponent?: Tabbed.Instance
    ) {
        super(client, "physics_engine");
    }

    protected onSubscribe() {
        console.log("Fetching...")

        this.sendToService({
            type: "FETCH_ENTITIES"
        });
        this.sendToService({
            type: "SPAWN_ENTITY"
        });

        this.tab = this.tabbedComponent?.addTab(this.serviceName, "Rust Physics");

        this.renderTab();
    }

    protected onUnsubscribe() {
        this.clearShapes();
        this.tabbedComponent?.removeTab(this.serviceName);
        this.tab = undefined;
    }


    protected onServiceMessage(payload: Readonly<PhysicsPayload>) {
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
                console.log("Dumping entities!");
                this.clearShapes();
                for (const entity of payload.entities) {
                    this.createShape(entity.id, entity.centroid, entity.points, entity.color);
                }
                break;
            case "POSITION_DUMP":
                for (const update of payload.updates) {
                    this.updateShape(update.id, update.position);
                }
                break;
            case "COLOR_UPDATE":
                this.updateColor(payload.id, payload.color);
                break;
            default:
                break;
        }
    }

    /** Render the controller component to the tab component. */
    renderTab() {
        if (this.tab) {
            this.tab.reactContent = React.createElement(PhysicsControllerComponent, { handler: this });
        }
    }

    /** Delete all shapes and meshes. */
    clearShapes() {
        for (const shape of this.shapes.values()) {
            shape.dispose();
        }
        this.shapes.clear();
    }

    private createShape(id: string, centroid: Vec2f, points: ReadonlyArray<Vec2f>, color: Readonly<RgbColor>) {
        const centroidv = vec2f2vector2(centroid);
        const pointsv = points.map(vec2f2vector2);
        const color3 = tuple2color3(color);
        const shape = PolygonObject.create(
            new Vector3(centroidv.x, 0, centroidv.y),
            pointsv,
            this.renderer.scene,
            color3,
            this.visualScale
        );
        this.shapes.set(id, shape);
        shape.mesh.actionManager!.registerAction(
            new ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    console.log("Clicking on object ", id, ".")
                    this.sendToService({
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
}