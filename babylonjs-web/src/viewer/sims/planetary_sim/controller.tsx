import { SystemData, SystemObject } from "./payloads";
import React from "react";
import { PlanetsHandler } from "./planets_handler";
import { Entry } from "../../../overlay/window/react";

export interface PlanetaryStateControllerProps {
    handler: PlanetsHandler
}
export class PlanetaryStateController extends React.Component<PlanetaryStateControllerProps> {
    constructor(props: PlanetaryStateControllerProps) {
        super(props);
        this.fb = this.fb.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.sf = this.sf.bind(this);
        this.ff = this.ff.bind(this);
    }

    fb() {
        this.props.handler.sendToSim({
            type: "FAST_BACKWARD"
        })
    }

    pause() {
        this.props.handler.sendToSim({
            type: "PAUSE"
        })
    }

    play() {
        this.props.handler.sendToSim({
            type: "PLAY"
        })
    }

    sf() {
        this.props.handler.sendToSim({
            type: "STEP_FORWARD"
        })
    }

    ff() {
        this.props.handler.sendToSim({
            type: "FAST_FORWARD"
        })
    }

    render() {
        return <div>
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
                values={[{ tag: "gravityConstant", value: this.props.data.gravityConstant }]}
            />
            <Entry name="Scale" onSubmit={this.props.onSubmit}
                values={[{ tag: "scale", value: this.props.data.scale }]}
            />
            <Entry name="Time Scale" onSubmit={this.props.onSubmit}
                values={[{ value: this.props.data.timeScale }]}
            />
            <Entry name="Body Scale" onSubmit={this.props.onSubmit}
                values={[{ tag: "bodyScale", value: this.props.data.bodyScale }]}
            />
            <Entry name="Central Body Scale" onSubmit={this.props.onSubmit}
                values={[{ tag: "centralBodyScale", value: this.props.data.centralBodyScale }]}
            />
            <Entry name="Elasticity" onSubmit={this.props.onSubmit}
                values={[{ tag: "elasticity", value: this.props.data.elasticity }]}
            />
            <Entry name="Central Body Name" onSubmit={this.props.onSubmit}
                values={[{ value: this.props.data.centralBodyName }]}
            />
            <Entry name="Hand Mass" onSubmit={this.props.onSubmit}
                values={[{ value: this.props.data.handMass }]}
            />
            <Entry name="Boundary" onSubmit={this.props.onSubmit}
                values={[{ tag: "boundary", value: this.props.data.boundary }]}
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
                values={[{ tag: "mass", value: this.props.data.mass }]}
            />
            <Entry name="Radius" onSubmit={this.props.onSubmit}
                values={[{ tag: "radius", value: this.props.data.radius }]}
            />
            <Entry name="Location" onSubmit={this.props.onSubmit}
                values={[
                    { tag: "location[0]", value: this.props.data.location[0] },
                    { tag: "location[1]", value: this.props.data.location[1] },
                    { tag: "location[2]", value: this.props.data.location[2] }
                ] }
            />
            <Entry name="Orbit Radius" onSubmit={this.props.onSubmit}
                values={[{ tag: "orbitRadius", value: this.props.data.orbitRadius }]}
            />
            <Entry name="Orbit Speed" onSubmit={this.props.onSubmit}
                values={[{ tag: "orbitSpeed", value: this.props.data.orbitSpeed }]}
            />
            <Entry name="Location" onSubmit={this.props.onSubmit}
                values={[
                    { tag: "direction[0]", value: this.props.data.direction[0] },
                    { tag: "direction[1]", value: this.props.data.direction[1] },
                    { tag: "direction[2]", value: this.props.data.direction[2] }
                ]}
            />
        </div>;
    }
}