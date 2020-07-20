import * as ConciergeAPI from "./concierge_api";
import { DeepImmutable, Vector2, DeepImmutableArray, Color3, ExecuteCodeAction, Vector3, DeepImmutableObject, Scene, PolygonMeshBuilder, StandardMaterial, ActionManager, MeshBuilder, Mesh } from "babylonjs";
import { Renderer } from "./renderer";

export const PLANET_SIM_NAME = "planetary_simulation";
export const PLANET_SIM_GROUP = "planetary_simulation_out";

interface SystemData {
    gravityConstant: number,
    scale: number,
    timeScale: number,
    bodyScale: number,
    centralBodyScale: number,
    elasticity: number,
    bodyCount: number,
    centralBodyName: string,
    handMass: number,
    boundary: number
}

interface SystemObject {
    name: string,
    mass: number,
    radius: number,
    locationX: number,
    locationY: number,
    locationZ: number,
    orbitRadius: number,
    orbitSpeed: number,
    directionX: number,
    directionY: number,
    directionZ: number
}

interface SystemDump {
    systemData: SystemData,
    objects: SystemObject[]
}

class PlanetShape {
    centroid: Vector3;
    mesh: Mesh;

    private constructor(centroid: Vector3, mesh: Mesh) {
        this.centroid = centroid;
        this.mesh = mesh;
    }

    static createSphere(centroid: Vector3, radius: number, scene: Scene, color: Color3, scale: number = 1): PlanetShape {
        let mesh = MeshBuilder.CreateSphere("mySphere", { diameter: radius * 2 * scale }, scene);
        mesh.position = centroid;

        var mat = new StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new ActionManager(scene);

        return new PlanetShape(centroid, mesh);
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

export class PlanetsHandler extends ConciergeAPI.ServiceEventHandler {
    readonly renderer: Renderer;
    readonly client: ConciergeAPI.Client;

    private planets: Map<string, PlanetShape>;
    private sysData!: SystemData;

    constructor(client: ConciergeAPI.Client, renderer: Renderer) {
        super(client, PLANET_SIM_GROUP);
        this.client = client;
        this.renderer = renderer;
        this.planets = new Map();
    }

    onRecvMessage(message: ConciergeAPI.Payloads.Message<SystemDump>) {
        if (message.origin!.name != PLANET_SIM_NAME) {
            return;
        }
        this.processPhysicsPayload(message.data);
    }

    onSubscribe() {
    }

    onUnsubscribe() {
        this.clearShapes();
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

    private processPhysicsPayload(payload: DeepImmutable<SystemDump>) {
        // console.log(payload);
        const visualScale = 500;
        this.sysData = payload.systemData;
        for (let obj of payload.objects) {
            let location = new Vector3(obj.locationX, obj.locationY, obj.locationZ)
                .scaleInPlace(1 / this.sysData.scale)
                .scaleInPlace(visualScale);
            if (this.planets.has(obj.name)) {
                this.planets.get(obj.name)!.moveTo(location)
            } else {
                if (this.renderer.scene) {
                    let radius = obj.radius / this.sysData.scale * this.sysData.bodyScale * visualScale;

                    let color = Color3.Black();
                    if (obj.name == this.sysData.centralBodyName) {
                        console.log("Found central body!")
                        radius *= this.sysData.centralBodyScale;
                        location.scaleInPlace(this.sysData.centralBodyScale);
                        color = Color3.Yellow();
                    }
                    
                    console.log(`Creating object (radius = ${radius}, location = ${location.toString()})`)

                    let shape = PlanetShape.createSphere(
                        location, radius, this.renderer.scene, color
                    );
                    this.planets.set(obj.name, shape);
                    this.renderer.shadowGenerator?.addShadowCaster(shape.mesh);
                } else {
                    throw new Error("Scene not initialized!")
                }
            }
        }
    }
}