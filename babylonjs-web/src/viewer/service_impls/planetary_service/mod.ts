import "./style.scss";

import * as BABYLON from 'babylonjs';
import { RendererView } from "../../renderer";
import Client, { ServiceEventHandler } from "../../../concierge_api/mod";
import { SystemData, PlanetaryPayload } from "./payloads";
import React from "react";
import { PlanetaryComponent } from "./components";
import { Tabbed } from "../../../overlay/mod";
import { PlanetObject } from "./objects";

export class PlanetaryService extends ServiceEventHandler<PlanetaryPayload> {
    /** Keeps latest batch of sys data */
    sysData?: SystemData;
    /** Map of planets */
    planets: Map<string, PlanetObject>;

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

                            let planet = PlanetObject.create(
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

    private clearShapes() {
        for (let key of this.planets.keys()) {
            const planet = this.planets.get(key)!;
            if (planet) {
                planet.dispose();
                this.planets.delete(key);
            }
        }
    }

    renderInformation(force: boolean = false) {
        if (!this.planetLock && this.hoveredPlanets.size == 0) {
            for (const planet of this.planets.values()) {
                planet.unlit();
            }
            this.litPlanet = undefined;
        } else {
            let planet: PlanetObject | undefined;
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

    async upload(formData: FormData) {
        const url = this.client.fileUrl(this.client.name, "system.json");
        const headers = new Headers();
        headers.append("x-fs-key", this.client.uuid);
        const response = await fetch(url, {
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
}