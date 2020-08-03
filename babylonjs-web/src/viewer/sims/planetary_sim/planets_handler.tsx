import "./style.scss";

import { Color3, ExecuteCodeAction, Vector3, DeepImmutableObject, Scene, StandardMaterial, ActionManager, MeshBuilder, Mesh, IAction, TrailMesh } from "babylonjs";
import { RendererView } from "../../renderer";
import { ServiceEventHandler } from "../../../concierge_api/handlers";
import { Client } from "../../../concierge_api/mod";
import { Payload } from "../../../concierge_api/payloads";
import { SystemObject, SystemData, PlanetaryPayload } from "./payloads";
import { Drawer } from "../../../overlay/mod";
import React from "react";
import ReactDOM from "react-dom";

export const PLANET_SIM_NAME = "planetary_simulation";
export const PLANET_SIM_GROUP = "planetary_simulation_out";

let controls_template: (locals?: any) => string = require("./controls.pug");
let system_info_template: (locals?: any) => string = require("./system_info.pug");
let planet_info_template: (locals?: any) => string = require("./planet_info.pug");

function htmlToElement(html: string): HTMLElement {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
}

class Planet {
    enterAction?: IAction;
    exitAction?: IAction;
    clickAction?: IAction;
    data?: SystemObject;

    private constructor(public id: string, public centroid: Vector3, public mesh: Mesh, public trailMesh?: TrailMesh) {
    }

    static create(id: string, centroid: Vector3, radius: number, scene: Scene, color: Color3, scale: number = 1): Planet {
        let mesh = MeshBuilder.CreateSphere("mySphere", { diameter: radius * 2 * scale }, scene);
        mesh.position = centroid;

        var mat = new StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new ActionManager(scene);

        let trailMesh = new TrailMesh("trail", mesh, scene, Math.min(0.02, radius * scale), 1000, true);

        return new Planet(id, centroid, mesh, trailMesh);
    }

    dispose() {
        this.unhookHover();
        this.trailMesh?.dispose();
        this.mesh.dispose();
    }

    hookHover(handler: PlanetInfoHandler) {
        if (this.mesh.actionManager) {
            this.enterAction = new ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    handler.hover(this.id);
                    handler.update();

                }
            );
            this.exitAction = new ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    handler.unhover(this.id);
                    handler.update();
                }
            );
            this.clickAction = new ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    if (handler.getLock() == this.id) {
                        handler.unlock();
                    } else {
                        handler.lock(this.id);
                    }
                    handler.update();
                }
            );
            this.mesh.actionManager.registerAction(this.enterAction);
            this.mesh.actionManager.registerAction(this.exitAction);
            this.mesh.actionManager.registerAction(this.clickAction);
        }
    }

    unhookHover() {
        if (this.mesh.actionManager) {
            if (this.enterAction) {
                this.mesh.actionManager.unregisterAction(this.enterAction);
                this.enterAction = undefined;
            }
            if (this.exitAction) {
                this.mesh.actionManager.unregisterAction(this.exitAction);
                this.exitAction = undefined;
            }
            if (this.clickAction) {
                this.mesh.actionManager.unregisterAction(this.clickAction);
                this.clickAction = undefined;
            }
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
    /** Keeps latest batch of sys data */
    sysData!: SystemData;
    /** Map of planets */
    planets: Map<string, Planet>;

    private readonly visualScale: number = 5;
    private controllerElement?: HTMLElement;
    infoHandler?: PlanetInfoHandler;

    constructor(
        client: Client,
        private readonly renderer: RendererView,
        private drawerUI?: Drawer.UI
    ) {
        super(client, PLANET_SIM_GROUP);
        this.planets = new Map();
    }

    onRecvMessage(message: Payload.Message<PlanetaryPayload>) {
        if (message.origin!.name != PLANET_SIM_NAME) {
            return;
        }
        this.processPlanetsPayload(message.data);
    }

    sendToSim(data: PlanetaryPayload) {
        this.client.sendJSON({
            type: "MESSAGE",
            target: {
                type: "NAME",
                name: PLANET_SIM_NAME
            },
            data
        });
    }

    onSubscribe() {
        this.controllerElement = htmlToElement(controls_template());
        this.infoHandler = new PlanetInfoHandler(this, this.controllerElement.querySelector<HTMLElement>(".planetary-controls .info")!);
        this.setupController(this.controllerElement);
        this.drawerUI?.addPopulatedTab(PLANET_SIM_NAME, "Planetary Controls", this.controllerElement);
        console.log("Planet simulator client is ready to go!");

        this.sendToSim({
            type: "FETCH_SYSTEM_DATA"
        });
    }

    setupController(controllerElement: HTMLElement) {
        controllerElement.querySelector(".planetary-pause")?.addEventListener("click", () => {
            this.sendToSim({
                type: "PAUSE"
            })
        });

        controllerElement.querySelector(".planetary-play")?.addEventListener("click", () => {
            this.sendToSim({
                type: "PLAY"
            })
        });

        controllerElement.querySelector(".planetary-sf")?.addEventListener("click", () => {
            this.sendToSim({
                type: "STEP_FORWARD"
            })
        });

        controllerElement.querySelector(".planetary-ff")?.addEventListener("click", () => {
            this.sendToSim({
                type: "FAST_FORWARD"
            })
        });

        controllerElement.querySelector(".planetary-fb")?.addEventListener("click", () => {
            this.sendToSim({
                type: "FAST_BACKWARD"
            })
        });

        let formElement = controllerElement.querySelector<HTMLFormElement>('.planetary-upload');
        formElement?.addEventListener('submit', (e) => {
            e.preventDefault()
            let formData = new FormData(formElement!);
            let url = new URL(window.location.href);
            url.port = "64209";
            this.upload(url, formData);
        });
    }

    async upload(baseURL: URL, formData: FormData) {
        const url = new URL(`/fs/${this.client.name}/system.json`, baseURL);
        const headers = new Headers();
        headers.append("x-fs-key", this.client.uuid);
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers,
            body: formData,
        });

        switch (response.status) {
            case 200:
            case 201:
                this.sendToSim({
                    type: "LOAD_SYSTEM",
                    url: url.toString()
                });
                break;
            default:
                alert("Unexpected response:" + response.status + " " + response.statusText);
        }
    }

    onUnsubscribe() {
        this.drawerUI?.removeTab(PLANET_SIM_NAME);
        this.controllerElement?.remove();
        this.clearShapes();
        this.infoHandler?.clear();
        this.infoHandler = undefined;
        console.log("Planet simulator client has disconnected!");
    }

    clearShapes() {
        for (let key of this.planets.keys()) {
            const planet = this.planets.get(key)!;
            if (planet) {
                // this.renderer.shadowGenerator?.removeShadowCaster(planet.mesh);
                planet.dispose();
                this.planets.delete(key);
            }
        }
    }

    private processPlanetsPayload(payload: PlanetaryPayload) {
        switch (payload.type) {
            case "SYSTEM_REMOVE_PLANETS":
                for (const id of payload.ids) {
                    let planet = this.planets.get(id);
                    if (planet) {
                        planet.dispose();
                        this.planets.delete(id);
                    }
                }
                break;
            case "SYSTEM_DATA_DUMP":
                this.sysData = payload.data;
                this.clearShapes();
                this.sendToSim({
                    type: "FETCH_SYSTEM_OBJS"
                });
                this.infoHandler!.update();
                break;
            case "SYSTEM_OBJS_DUMP":
                if (this.sysData == undefined) {
                    return;
                }
                for (let obj of payload.objects) {
                    let location = new Vector3(obj.location[0], obj.location[1], obj.location[2])
                        .scaleInPlace(1 / this.sysData.scale)
                        .scaleInPlace(this.visualScale);

                    if (this.planets.has(obj.name)) {
                        let planet = this.planets.get(obj.name)!;
                        planet.moveTo(location);
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

                            // console.log(`Creating object (radius = ${radius}, location = ${location.toString()})`)

                            let planet = Planet.create(
                                obj.name,
                                location,
                                radius,
                                this.renderer.scene,
                                color
                            );
                            if (this.infoHandler) {
                                planet.hookHover(this.infoHandler);
                            }
                            planet.data = obj;

                            this.planets.set(obj.name, planet);
                            // this.renderer.shadowGenerator?.addShadowCaster(planet.mesh);
                        } else {
                            throw new Error("Scene not initialized!")
                        }
                    }
                }
                this.infoHandler!.update();
                break;
            case "SYSTEM_CLEAR":
                console.log("Clearing shapes");
                this.infoHandler!.clear();
                this.clearShapes();
                break;
        }
    }
}

enum InfoPaneType {
    None,
    System,
    Planet
}

class PlanetInfoHandler {
    /** Keeps track of the planet IDs that are hovered over. */
    private infoPaneType: InfoPaneType = InfoPaneType.None;
    private planetLock?: string;
    private hoveredPlanets: Set<string> = new Set();
    private inputTarget?: string;
    private littedPlanet?: string;
    private unlockAction?: number;
    private lockedInputs: HTMLInputElement[] = [];

    constructor(private handler: PlanetsHandler, private rootElement: HTMLElement) { }

    getLock(): string | undefined {
        return this.planetLock;
    }

    lock(id: string) {
        this.planetLock = id;
    }

    unlock() {
        this.planetLock = undefined;
    }

    hover(id: string) {
        this.hoveredPlanets.add(id);
    }

    unhover(id: string) {
        this.hoveredPlanets.delete(id);
    }

    clear() {
        this.hoveredPlanets.clear();
        this.planetLock = undefined;
        this.rootElement.innerHTML = "";
        this.infoPaneType = InfoPaneType.None;
    }

    update() {
        if (this.planetLock) {
            let planet = this.handler.planets.get(this.planetLock)!;
            this.updateInfoPlanet(planet);
        } else if (this.hoveredPlanets.size != 0) {
            let first = this.hoveredPlanets.values().next()!;
            let planet = this.handler.planets.get(first.value)!;
            this.updateInfoPlanet(planet);
        } else {
            this.updateInfoSystem(this.handler.sysData);
        }
    }

    unlitPlanet(planet: Planet | undefined) {
        if (planet) {
            (planet.mesh.material as StandardMaterial).emissiveColor = Color3.Black();
            this.littedPlanet = undefined;
        }
    }

    litPlanet(planet: Planet | undefined) {
        if (planet) {
            (planet.mesh.material as StandardMaterial).emissiveColor = Color3.Red();
            this.littedPlanet = planet.id;
        }
    }

    private updateInfoPlanet(planet: Planet) {
        if (this.littedPlanet && this.littedPlanet != planet.id) {
            let planet = this.handler.planets.get(this.littedPlanet)!;
            this.unlitPlanet(planet)
        }

        if (this.infoPaneType != InfoPaneType.Planet) {
            this.rootElement.innerHTML = planet_info_template();
            this.setupInputFields(planet.id);
            this.infoPaneType = InfoPaneType.Planet;
        } else if (this.inputTarget != planet.id) {
            this.setupInputFields(planet.id);
        }

        this.updateInputFields(planet.data);

        this.litPlanet(planet)
    }

    private updateInfoSystem(sysData: SystemData) {
        if (this.littedPlanet) {
            let planet = this.handler.planets.get(this.littedPlanet)!;
            (planet.mesh.material as StandardMaterial).emissiveColor = Color3.Black();
            this.littedPlanet = undefined;
        }

        if (this.infoPaneType != InfoPaneType.System) {
            this.rootElement.innerHTML = system_info_template();
            this.setupInputFields("system");
            this.infoPaneType = InfoPaneType.System;
        }

        this.updateInputFields(sysData);
    }

    private setupInputFields(id: string) {
        for (const input of this.rootElement.querySelectorAll("input")) {
            let attr = input.getAttribute("var");
            if (attr) {
                input.onkeydown = (event) => {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        // alert("Updating [" + id + "] " + attr + ": " + input.value);
                        this.handler.sendToSim({
                            type: "UPDATE_DATA",
                            target: id,
                            field: attr!,
                            value: input.value
                        })
                    }
                };
            }
        }
        this.inputTarget = id;
    }

    private updateInputFields(obj: any | undefined) {
        if (obj) {
            clearTimeout(this.unlockAction);
            for (const elem of this.rootElement.querySelectorAll<HTMLElement>("input,[var]")) {
                let attr = elem.getAttribute("var");
                if (attr) {
                    if (elem.nodeName == "INPUT") {
                        let input = elem as HTMLInputElement;
                        input.value = eval(`obj.${attr}`);

                        if (elem.getAttribute("readonly") != "always") {
                            input.readOnly = true;
                            this.lockedInputs.push(input);
                        }
                    } else {
                        elem.textContent = eval(`obj.${attr}`);
                    }
                }
            }
            this.unlockAction = window.setTimeout(() => {
                for (const input of this.lockedInputs) {
                    input.readOnly = false;
                }
                this.lockedInputs.length = 0;
            }, 200);
        }
    }
}

// class SystemInfoComponent extends React.Component<{data: SystemData}> {
//     render() {
//         function Entry(props: { name: string, value: any }) {
//             return (
//                 <div className="entry">
//                     <div className="name">{props.name}</div>
//                     <div className="value"><input value={props.value} /></div>
//                 </div>
//             );
//         }

//         return (
//             <div>
//                 <div className="name">
//                     <div className="value">System</div>
//                 </div>
//                 <Entry name="Gravity Constant" value={this.props.data.gravityConstant}/>
//                 <Entry name="Scale" value={this.props.data.scale} />
//                 <Entry name="Time Scale" value={this.props.data.timeScale}/>
//                 <Entry name="Body Scale" value={this.props.data.bodyScale}/>
//                 <Entry name="Central Body Scale" value={this.props.data.centralBodyScale}/>
//                 <Entry name="Elasticity" value={this.props.data.elasticity}/>
//                 <Entry name="Central Body Name" value={this.props.data.centralBodyName}/>
//                 <Entry name="Hand Mass" value={this.props.data.handMass}/>
//                 <Entry name="Boundary" value={this.props.data.boundary}/>
//             </div>
//         );
//     }
// }
