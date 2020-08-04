import { SystemData, SystemObject } from "./payloads";

import { PlanetsHandler } from "./planets_handler";
import { Entry, TabHeader, TabBody, TabBox } from "../../../overlay/window/react";
import React from "react";
import ReactDOM from "react-dom";

export function renderController(handler: PlanetsHandler, element: HTMLElement) {
    ReactDOM.render(
        <PlanetaryComponent handler={handler}/>,
        element
    );
}

export interface PlanetaryComponentProps {
    handler: PlanetsHandler
}
export class PlanetaryComponent extends React.Component<PlanetaryComponentProps> {
    render() {
        return <div className="planetary-controls">
            <TabHeader>
                <PlanetaryStateComponent handler={this.props.handler} />
                <PlanetaryInfoComponent handler={this.props.handler} />
            </TabHeader>
            <TabBody>
                <PlanetaryUploadComponent handler={this.props.handler} />
                <TabBox>
                    <h2>Planetary Simulation</h2>
                    <p>Python Simulation by Alison Noyes</p>
                    <p>BabylonJS Front-end by An Tran</p>
                </TabBox>
            </TabBody>
        </div>
    }
}

class PlanetaryInfoComponent extends React.Component<PlanetaryComponentProps> {
    handleFieldUpdate(target: string, tag: string, value: string) {
        this.props.handler.sendToSim({
            type: "UPDATE_DATA",
            target,
            field: tag,
            value
        });
    }

    conditional() {
        let handler = this.props.handler;
        if (handler.planetLock) {
            let planet = handler.planets.get(handler.planetLock)!;
            return <PlanetInfoComponent
                data={planet.data}
                onSubmit={(tag, value) => this.handleFieldUpdate(planet.id, tag, value)}
            />
        } else if (handler.hoveredPlanets.size != 0) {
            let first = handler.hoveredPlanets.values().next()!;
            let planet = handler.planets.get(first.value)!;
            return <PlanetInfoComponent
                data={planet.data}
                onSubmit={(tag, value) => this.handleFieldUpdate(planet.id, tag, value)}
            />
        } else {
            return <SystemInfoComponent
                data={handler.sysData}
                onSubmit={(tag, value) => this.handleFieldUpdate("system", tag, value)}
            />
        }
    }

    render() {
        return <div className="info">
            {this.conditional()}
        </div>
    }
}

class PlanetaryUploadComponent extends React.Component<PlanetaryComponentProps> {
    submitHandler(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault()
        let formData = new FormData(event.currentTarget);
        let url = new URL(window.location.href);
        url.port = "64209";
        this.props.handler.upload(url, formData);
    }

    render() {
        return <TabBox>
            <h2>Upload JSON System</h2>
            <p>Try out your own planetary systems!</p>
            <form className="planetary-upload" onSubmit={event => this.submitHandler(event)}>
                <input type="file" name="file" />
                <button type="submit">Submit</button>
            </form>
        </TabBox>
    }
}

export class PlanetaryStateComponent extends React.Component<PlanetaryComponentProps> {
    constructor(props: PlanetaryComponentProps) {
        super(props);
    }

    private sendState(type: any) {
        this.props.handler.sendToSim({
            type
        });
    }

    private fb = () => this.sendState("FAST_BACKWARD");
    private pause = () => this.sendState("PAUSE");
    private play = () => this.sendState("PLAY");
    private sf = () => this.sendState("STEP_FORWARD");
    private ff = () => this.sendState("FAST_FORWARD");

    render() {
        return <div className="icons">
            <i className="fa fa-fast-backward" onClick={this.fb}></i>
            <i className="fa fa-pause" onClick={this.pause}></i>
            <i className="fa fa-play" onClick={this.play}></i>
            <i className="fa fa-step-forward" onClick={this.sf}></i>
            <i className="fa fa-fast-forward" onClick={this.ff}></i>
        </div>;
    }
}

interface SystemInfoComponentProps {
    data: SystemData,
    onSubmit?: (tag: string, value: string) => void,
}
export class SystemInfoComponent extends React.Component<SystemInfoComponentProps> {
    render() {
        return <div>
            <h1>SYSTEM</h1>
            <Entry name="Gravity Constant" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "gravityConstant", value: this.props.data.gravityConstant }]}
            />
            <Entry name="Scale" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "scale", value: this.props.data.scale }]}
            />
            <Entry name="Time Scale" onSubmit={this.props.onSubmit}
                inputs={[{ value: this.props.data.timeScale }]}
            />
            <Entry name="Body Scale" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "bodyScale", value: this.props.data.bodyScale }]}
            />
            <Entry name="Central Body Scale" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "centralBodyScale", value: this.props.data.centralBodyScale }]}
            />
            <Entry name="Elasticity" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "elasticity", value: this.props.data.elasticity }]}
            />
            <Entry name="Central Body Name" onSubmit={this.props.onSubmit}
                inputs={[{ value: this.props.data.centralBodyName }]}
            />
            <Entry name="Hand Mass" onSubmit={this.props.onSubmit}
                inputs={[{ value: this.props.data.handMass }]}
            />
            <Entry name="Boundary" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "boundary", value: this.props.data.boundary }]}
            />
        </div>;
    }
}

interface PlanetInfoComponentProps {
    data: SystemObject,
    onSubmit?: (tag: string, value: string) => void,
}
export class PlanetInfoComponent extends React.Component<PlanetInfoComponentProps> {
    render() {
        return <div>
            <h1>{this.props.data.name.toUpperCase()}</h1>
            <Entry name="Mass" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "mass", value: this.props.data.mass }]}
            />
            <Entry name="Radius" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "radius", value: this.props.data.radius }]}
            />
            <Entry name="Location" onSubmit={this.props.onSubmit}
                inputs={[
                    { tag: "location[0]", value: this.props.data.location[0] },
                    { tag: "location[1]", value: this.props.data.location[1] },
                    { tag: "location[2]", value: this.props.data.location[2] }
                ]}
            />
            <Entry name="Orbit Radius" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "orbitRadius", value: this.props.data.orbitRadius }]}
            />
            <Entry name="Orbit Speed" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "orbitSpeed", value: this.props.data.orbitSpeed }]}
            />
            <Entry name="Location" onSubmit={this.props.onSubmit}
                inputs={[
                    { tag: "direction[0]", value: this.props.data.direction[0] },
                    { tag: "direction[1]", value: this.props.data.direction[1] },
                    { tag: "direction[2]", value: this.props.data.direction[2] }
                ]}
            />
        </div>;
    }
}