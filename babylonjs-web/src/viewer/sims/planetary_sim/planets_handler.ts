import "./style.scss";

import { DeepImmutable, Color3, ExecuteCodeAction, Vector3, DeepImmutableObject, Scene, StandardMaterial, ActionManager, MeshBuilder, Mesh, IAction } from "babylonjs";
import { Renderer } from "../../renderer";
import { ServiceEventHandler } from "../../../concierge_api/handlers";
import { Client } from "../../../concierge_api/mod";
import { Payload } from "../../../concierge_api/payloads";
import { SystemObject, SystemDump, SystemData, PlanetaryPayload } from "./payloads";
import { controlWindowUI } from "../../viewer";

export const PLANET_SIM_NAME = "planetary_simulation";
export const PLANET_SIM_GROUP = "planetary_simulation_out";

let controls_template: (locals?: any) => string = require("./controls.pug");
let info_template: (locals?: any) => string = require("./info.pug");

function htmlToElement(html: string): HTMLElement {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
}

class Planet {
    id: string;
    centroid: Vector3;
    mesh: Mesh;
    enterAction?: IAction;
    exitAction?: IAction;
    clickAction?: IAction;
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

    hookHover(handler: PlanetsHandler) {
        this.enterAction = new ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            () => {
                handler.hoveredPlanets.add(this.id);
                handler.updateInfoDiv();
            }
        );
        this.exitAction = new ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            () => {
                handler.hoveredPlanets.delete(this.id);
                handler.updateInfoDiv();
            }
        );
        this.clickAction = new ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
                if (handler.planetLock == this.id) {
                    handler.planetLock = undefined;
                } else {
                    handler.planetLock = this.id;
                }
            }
        );
        this.mesh.actionManager!.registerAction(this.enterAction);
        this.mesh.actionManager!.registerAction(this.exitAction);
        this.mesh.actionManager!.registerAction(this.clickAction);
    }

    unhookHover() {
        if (this.enterAction) {
            this.mesh.actionManager?.unregisterAction(this.enterAction);
            this.enterAction = undefined;
        }
        if (this.exitAction) {
            this.mesh.actionManager?.unregisterAction(this.exitAction);
            this.exitAction = undefined;
        }
        if (this.clickAction) {
            this.mesh.actionManager?.unregisterAction(this.clickAction);
            this.clickAction = undefined;
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

    /** Map of planets */
    private planets: Map<string, Planet>;
    /** Keeps track of the planet IDs that are hovered over. */
    planetLock?: string;
    hoveredPlanets: Set<string> = new Set();

    /** Keeps latest batch of sys data */
    private sysData!: SystemData;
    private readonly visualScale: number = 5;
    private controllerElement?: HTMLElement;

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
        this.controllerElement = htmlToElement(controls_template());
        this.setupController(this.controllerElement);
        controlWindowUI.addTab(PLANET_SIM_NAME, "Planetary Controls", this.controllerElement);
        console.log("Planet simulator client is ready to go!");
    }

    setupController(controllerElement: HTMLElement) {
        let pauseButton = controllerElement.querySelector("#planetary-pause");
        pauseButton?.addEventListener("click", () => {
            this.client.sendJSON({
                type: "MESSAGE",
                target: {
                    type: "NAME",
                    name: PLANET_SIM_NAME
                },
                data: {
                    type: "PAUSE"
                }
            })
        });

        let playButton = controllerElement.querySelector("#planetary-play");
        playButton?.addEventListener("click", () => {
            this.client.sendJSON({
                type: "MESSAGE",
                target: {
                    type: "NAME",
                    name: PLANET_SIM_NAME
                },
                data: {
                    type: "PLAY"
                }
            })
        });

        let ffButton = controllerElement.querySelector("#planetary-ff");
        ffButton?.addEventListener("click", () => {
            this.client.sendJSON({
                type: "MESSAGE",
                target: {
                    type: "NAME",
                    name: PLANET_SIM_NAME
                },
                data: {
                    type: "FASTFORWARD"
                }
            })
        });

        let fbButton = controllerElement.querySelector("#planetary-fb");
        fbButton?.addEventListener("click", () => {
            this.client.sendJSON({
                type: "MESSAGE",
                target: {
                    type: "NAME",
                    name: PLANET_SIM_NAME
                },
                data: {
                    type: "FASTBACKWARD"
                }
            })
        });

        let uploadForm = controllerElement.querySelector<HTMLFormElement>('#planetary-upload')!;
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let formData = new FormData(uploadForm);
            let url = new URL(window.location.href);
            url.port = "64209";
            this.upload(url, formData);
        });
    }

    async upload(baseURL: URL, formData: FormData) {
        let url = new URL(`/fs/${this.client.name}/system.json`, baseURL);
        let response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                authorization: this.client.uuid
            },
            body: formData,
        });
        switch (response.status) {
            case 200:
            case 201:
                this.client.sendJSON({
                    type: "MESSAGE",
                    target: {
                        type: "NAME",
                        name: PLANET_SIM_NAME
                    },
                    data: {
                        type: "LOAD_SYSTEM",
                        url: url.toString()
                    }
                })
                break;
            default:
                alert("Unexpected response:" + response.status + " " + response.statusText);
        }
    }

    onUnsubscribe() {
        controlWindowUI.removeTab(PLANET_SIM_NAME);
        this.controllerElement?.remove();
        this.clearShapes();
        this.hoveredPlanets.clear();
        this.planetLock = undefined;
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

    private processPlanetsPayload(payload: PlanetaryPayload) {
        switch (payload.type) {
            case "SYSTEM_DUMP": 
                this.sysData = payload.systemData;
                for (let obj of payload.objects) {
                    let location = new Vector3(obj.location[0], obj.location[1], obj.location[2])
                        .scaleInPlace(1 / this.sysData.scale)
                        .scaleInPlace(this.visualScale);

                    if (this.planets.has(obj.name)) {
                        let planet = this.planets.get(obj.name)!;
                        planet.moveTo(location)
                        planet.data = obj;
                    } else {
                        if (this.renderer.scene) {
                            let radius = obj.radius / this.sysData.scale * this.sysData.bodyScale * this.visualScale;

                            let color = Color3.FromArray(obj.color);
                            if (obj.name == this.sysData.centralBodyName) {
                                console.log("Found central body!")
                                radius *= this.sysData.centralBodyScale;
                                location.scaleInPlace(this.sysData.centralBodyScale);
                            }

                            console.log(`Creating object (radius = ${radius}, location = ${location.toString()})`)

                            let planet = Planet.create(
                                obj.name,
                                location,
                                radius,
                                this.renderer.scene,
                                color
                            );
                            planet.hookHover(this);
                            planet.data = obj;

                            this.planets.set(obj.name, planet);
                            this.renderer.shadowGenerator?.addShadowCaster(planet.mesh);
                        } else {
                            throw new Error("Scene not initialized!")
                        }
                    }
                }
                this.updateInfoDiv();
                break;
            case "SYSTEM_CLEAR":
                console.log("Clearing shapes");
                this.hoveredPlanets.clear();
                this.planetLock = undefined;
                this.clearShapes();
                break;
        }
    }

    updateInfoDiv() {
        let infoDiv = this.controllerElement?.querySelector<HTMLElement>(".planetary-controls .info");

        if (infoDiv) {
            if (this.planetLock) {
                let planet = this.planets.get(this.planetLock)!;
                this.updateInfo(infoDiv, planet, true);
            } else if (this.hoveredPlanets.size != 0) {
                let first = this.hoveredPlanets.values().next()!;
                let planet = this.planets.get(first.value)!;
                this.updateInfo(infoDiv, planet);
            } else {
                infoDiv.innerText = "Hover over a planet.";
                for (let planet of this.planets.values()) {
                    (planet.mesh.material as StandardMaterial).diffuseColor = Color3.FromArray(planet.data!.color);
                }
            }
        }
    }

    updateInfo(infoDiv: HTMLElement, planet: Planet, lock: boolean = false) {
        (planet.mesh.material as StandardMaterial).diffuseColor = Color3.Red();
        infoDiv.innerHTML = info_template({lock, ...planet.data});
    }
}