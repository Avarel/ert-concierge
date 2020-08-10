import "./style.scss";

import * as BABYLON from 'babylonjs';
import { RendererView } from "../../renderer";
import Client, { ServiceEventHandler } from "../../../concierge_api/mod";
import { SystemObject, SystemData, PlanetaryPayload } from "./payloads";
import React from "react";
import { PlanetaryComponent } from "./components";
import { Tabbed } from "../../../overlay/mod";

class Planet {
    private enterAction?: BABYLON.IAction;
    private exitAction?: BABYLON.IAction;
    private clickAction?: BABYLON.IAction;
    data!: SystemObject;

    private constructor(
        public readonly id: string,
        private centroid: BABYLON.Vector3,
        public mesh: BABYLON.Mesh,
        public trailMesh?: BABYLON.TrailMesh
    ) { }

    static create(id: string, centroid: BABYLON.Vector3, radius: number, scene: BABYLON.Scene, color: BABYLON.Color3, scale: number = 1): Planet {
        let mesh = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: radius * 2 * scale }, scene);
        mesh.position = centroid;

        var mat = new BABYLON.StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new BABYLON.ActionManager(scene);
        // mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mat.emissiveColor));
        // mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.Red()));

        let trailMesh = new BABYLON.TrailMesh("trail", mesh, scene, Math.min(0.02, radius * scale), 1000, true);

        return new Planet(id, centroid, mesh, trailMesh);
    }

    dispose() {
        this.unhookHover();
        this.trailMesh?.dispose();
        this.mesh.dispose();
    }

    hookHover(handler: PlanetaryService) {
        if (this.mesh.actionManager) {
            this.enterAction = new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    handler.hoveredPlanets.add(this.id);
                    handler.renderInformation();
                }
            );
            this.exitAction = new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    handler.hoveredPlanets.delete(this.id);
                    handler.renderInformation();
                }
            );
            this.clickAction = new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    if (handler.planetLock == this.id) {
                        handler.planetLock = undefined;
                    } else {
                        handler.planetLock = this.id;
                    }
                    handler.renderInformation();
                }
            );
            this.mesh.actionManager.registerAction(this.enterAction);
            this.mesh.actionManager.registerAction(this.exitAction);
            this.mesh.actionManager.registerAction(this.clickAction);
        }
    }

    unlit() {
        (this.mesh.material as BABYLON.StandardMaterial).emissiveColor = BABYLON.Color3.Black();

    }

    lit() {
        (this.mesh.material as BABYLON.StandardMaterial).emissiveColor = BABYLON.Color3.Red();
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

    setColor(color: Readonly<BABYLON.Color3>) {
        (this.mesh.material! as BABYLON.StandardMaterial).diffuseColor! = color;
    }

    moveTo(point: Readonly<BABYLON.Vector3>) {
        let translate = point.subtract(this.centroid);

        this.mesh.position.addInPlace(translate);
        this.centroid.set(point.x, point.y, point.z);
    }
}

export class PlanetaryService extends ServiceEventHandler<PlanetaryPayload> {
    /** Keeps latest batch of sys data */
    sysData?: SystemData;
    /** Map of planets */
    planets: Map<string, Planet>;

    private readonly visualScale: number = 5;
    private tab?: Tabbed.Tab;

    planetLock?: string;
    hoveredPlanets: Set<string> = new Set();
    litPlanet?: string;

    constructor(
        client: Client,
        readonly view: RendererView,
        private tabbedComponent?: Tabbed.Instance
    ) {
        super(client, "planetary_simulation");
        this.planets = new Map();
    }

    renderInformation(force: boolean = false) {
        if (!this.planetLock && this.hoveredPlanets.size == 0) {
            for (const planet of this.planets.values()) {
                planet.unlit();
            }
            this.litPlanet = undefined;
        } else {
            let planet: Planet | undefined;
            if (this.planetLock) {
                planet = this.planets.get(this.planetLock);
            } else {
                planet = this.planets.get(this.hoveredPlanets.values().next().value);
            }
            if (planet && planet.id != this.litPlanet) {
                if (this.litPlanet) {
                    let prevLitPlanet = this.planets.get(this.litPlanet);
                    prevLitPlanet?.unlit();
                }

                planet.lit();
                this.litPlanet = planet.id;
            }
        }

        if (this.tab && (this.tab.isActive || force)) {
            this.tab!.reactContent = React.createElement(PlanetaryComponent, { handler: this });
        }
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
                this.sendToService({
                    type: "LOAD_SYSTEM",
                    url: url.toString()
                });
                break;
            default:
                alert("Unexpected response:" + response.status + " " + response.statusText);
        }
    }

    protected onSubscribe() {
        this.tab = this.tabbedComponent?.addTab(this.serviceName, "Planetary Controls");
        console.log("Planet simulator client is ready to go!");

        this.sendToService({
            type: "FETCH_SYSTEM_DATA"
        });
    }

    protected onUnsubscribe() {
        this.tabbedComponent?.removeTab(this.serviceName);
        this.clearShapes();
        console.log("Planet simulator client has disconnected!");
    }

    private clearShapes() {
        for (let key of this.planets.keys()) {
            const planet = this.planets.get(key)!;
            if (planet) {
                planet.dispose();
                this.planets.delete(key);
            }
        }
    }

    protected onServiceMessage(payload: PlanetaryPayload) {
        switch (payload.type) {
            case "SYSTEM_REMOVE_PLANETS":
                for (const id of payload.ids) {
                    let planet = this.planets.get(id);
                    if (planet) {
                        planet.dispose();
                        this.planets.delete(id);
                    }
                }
                this.renderInformation();
                break;
            case "SYSTEM_DATA_DUMP":
                this.sysData = payload.data;
                this.clearShapes();
                this.sendToService({
                    type: "FETCH_SYSTEM_OBJS"
                });
                this.renderInformation(true);
                break;
            case "SYSTEM_OBJS_DUMP":
                if (this.sysData == undefined) {
                    return;
                }
                for (let obj of payload.objects) {
                    let location = new BABYLON.Vector3(obj.location[0], obj.location[1], obj.location[2])
                        .scaleInPlace(1 / this.sysData.scale)
                        .scaleInPlace(this.visualScale);

                    if (this.planets.has(obj.name)) {
                        let planet = this.planets.get(obj.name)!;
                        planet.moveTo(location);
                        planet.data = obj;
                    } else {
                        if (this.view.scene) {
                            let radius = obj.radius / this.sysData.scale * this.sysData.bodyScale * this.visualScale;

                            let color = BABYLON.Color3.FromArray(obj.color);
                            if (obj.name == this.sysData.centralBodyName) {
                                console.log("Found central body!")
                                radius *= this.sysData.centralBodyScale;
                                location.scaleInPlace(this.sysData.centralBodyScale);
                            }

                            let planet = Planet.create(
                                obj.name,
                                location,
                                radius,
                                this.view.scene,
                                color
                            );
                            planet.hookHover(this);
                            planet.data = obj;

                            this.planets.set(obj.name, planet);
                        } else {
                            throw new Error("Scene not initialized!")
                        }
                    }
                }
                this.renderInformation();
                break;
            case "SYSTEM_CLEAR":
                console.log("Clearing shapes");
                this.renderInformation();
                this.clearShapes();
                break;
        }
    }
}