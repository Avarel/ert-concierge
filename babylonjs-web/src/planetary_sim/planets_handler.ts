import "./style.scss";

import { DeepImmutable, Color3, ExecuteCodeAction, Vector3, DeepImmutableObject, Scene, StandardMaterial, ActionManager, MeshBuilder, Mesh } from "babylonjs";
import { Renderer } from "../renderer";
import { ServiceEventHandler } from "../concierge_api/handlers";
import { Client } from "../concierge_api/mod";
import { Payload } from "../concierge_api/payloads";
import { SystemObject, SystemDump, SystemData } from "./payloads";

export const PLANET_SIM_NAME = "planetary_simulation";
export const PLANET_SIM_GROUP = "planetary_simulation_out";

class Planet {
    id: string;
    centroid: Vector3;
    mesh: Mesh;
    enterAction?: ExecuteCodeAction;
    exitAction?: ExecuteCodeAction;
    data?: SystemObject;

    private constructor(id: string, centroid: Vector3, mesh: Mesh) {
        this.id = id;
        this.centroid = centroid;
        this.mesh = mesh;
    }

    static create(id: string, centroid: Vector3, radius: number, scene: Scene, color: Color3, scale: number = 1): Planet {
        let mesh = MeshBuilder.CreateSphere("mySphere", { diameter: radius * 2 * scale }, scene);
        mesh.position = centroid;

        var mat = new StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new ActionManager(scene);

        return new Planet(id, centroid, mesh);
    }

    hookHover(set: Set<string>) {
        this.enterAction = new ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            () => set.add(this.id)
        );
        this.exitAction = new ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            () => set.delete(this.id)
        );
        this.mesh.actionManager!.registerAction(this.enterAction);
        this.mesh.actionManager!.registerAction(this.exitAction);
    }

    unhookHover() {
        if (this.enterAction) {
            this.mesh.actionManager?.unregisterAction(this.enterAction);
        }
        if (this.exitAction) {
            this.mesh.actionManager?.unregisterAction(this.exitAction);
        }
    }

    setColor(color: DeepImmutableObject<Color3>) {
        (this.mesh.material! as StandardMaterial).diffuseColor! = color;
    }

    moveTo(point: DeepImmutableObject<Vector3>) {
        let translate = point.subtract(this.centroid);

        this.mesh.position.addInPlace(translate);
        this.centroid.set(point.x, point.y, point.z);
    }
}

export class PlanetsHandler extends ServiceEventHandler {
    readonly renderer: Renderer;
    readonly client: Client;

    private planets: Map<string, Planet>;
    /** Keeps track of the planet IDs that are hovered over. */
    private hoveredPlanets: Set<string> = new Set();
    private sysData!: SystemData;
    private readonly visualScale: number = 500;

    constructor(client: Client, renderer: Renderer) {
        super(client, PLANET_SIM_GROUP);
        this.client = client;
        this.renderer = renderer;
        this.planets = new Map();
    }

    onRecvMessage(message: Payload.Message<SystemDump>) {
        if (message.origin!.name != PLANET_SIM_NAME) {
            return;
        }
        this.processPlanetsPayload(message.data);
    }

    onSubscribe() {
        console.log("Planet simulator client is ready to go!");
    }

    onUnsubscribe() {
        this.clearShapes();
        console.log("Planet simulator client has disconnected!");
    }

    clearShapes() {
        for (let key of this.planets.keys()) {
            if (this.planets.has(key)) {
                let shape = this.planets.get(key)!;
                this.renderer.shadowGenerator?.removeShadowCaster(shape.mesh);
                shape.mesh.dispose();
                this.planets.delete(key);
            }
        }
    }

    private processPlanetsPayload(payload: DeepImmutable<SystemDump>) {
        this.sysData = payload.systemData;
        for (let obj of payload.objects) {
            let location = new Vector3(obj.locationX, obj.locationY, obj.locationZ)
                .scaleInPlace(1 / this.sysData.scale)
                .scaleInPlace(this.visualScale);
                
            if (this.planets.has(obj.name)) {
                let planet = this.planets.get(obj.name)!;
                planet.moveTo(location)
                planet.data = obj;
            } else {
                if (this.renderer.scene) {
                    let radius = obj.radius / this.sysData.scale * this.sysData.bodyScale * this.visualScale;

                    let color = Color3.Black();
                    if (obj.name == this.sysData.centralBodyName) {
                        console.log("Found central body!")
                        radius *= this.sysData.centralBodyScale;
                        location.scaleInPlace(this.sysData.centralBodyScale);
                        color = Color3.Yellow();
                    }

                    console.log(`Creating object (radius = ${radius}, location = ${location.toString()})`)

                    let planet = Planet.create(
                        obj.name,
                        location,
                        radius,
                        this.renderer.scene,
                        color
                    );
                    planet.hookHover(this.hoveredPlanets);
                    planet.data = obj;

                    this.planets.set(obj.name, planet);
                    this.renderer.shadowGenerator?.addShadowCaster(planet.mesh);
                } else {
                    throw new Error("Scene not initialized!")
                }
            }
        }

        // TODO: work in progress, MVP code
        if (this.hoveredPlanets.size == 0) {
            document.querySelector<HTMLElement>(".planetary-controls .info")!.innerText = "Hover over a planet."
        } else {
            let first = this.hoveredPlanets.values().next()!;
            let planet = this.planets.get(first.value)!;
            document.querySelector<HTMLElement>(".planetary-controls .info")!.innerText = JSON.stringify(planet.data, undefined, 2);
        }
    }
}