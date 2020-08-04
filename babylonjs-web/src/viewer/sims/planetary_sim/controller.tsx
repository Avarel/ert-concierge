import { SystemData, SystemObject } from "./payloads";

import { PlanetsHandler } from "./planets_handler";
import { Entry, TabHeader, TabBody, TabBox } from "../../../overlay/window/react";
import React from "react";
import ReactDOM from "react-dom";

export function renderController(handler: PlanetsHandler, element: HTMLElement) {
    ReactDOM.render(
        <PlanetaryComponent handler={handler} />,
        element
    );
}

interface RenderingInfoState {
    fps: number | string,
    fdelta: number | string,
    pmeshes: number | string,
}
class RenderingInfo extends React.Component<PlanetaryComponentProps, RenderingInfoState> {
    loop?: number;

    constructor(props: PlanetaryComponentProps) {
        super(props);
        this.state = {
            fps: 0,
            fdelta: 0,
            pmeshes: 0
        };
    }

    componentDidMount() {
        this.loop = window.setInterval(() => {
            this.setState(() => ({
                fps: this.props.handler.view.renderer.engine.getFps().toFixed(2),
                fdelta: this.props.handler.view.renderer.engine.getDeltaTime().toFixed(2),
                pmeshes: this.props.handler.planets.size,
            }));
        }, 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.loop);
    }

    render() {
        const handler = this.props.handler;
        return <TabBox>
            <h2>Rendering Statistics</h2>
            <Entry name="FPS" inputs={[{ value: this.state.fps }]} />
            <Entry name="Frame Delta" inputs={[{ value: `${this.state.fdelta}ms` }]} />
            <Entry name="Planet Meshes" inputs={[{ value: this.state.pmeshes }]} />
        </TabBox>;
    }
}

interface PlanetaryComponentProps {
    handler: PlanetsHandler
}
class PlanetaryComponent extends React.Component<PlanetaryComponentProps> {
    render() {
        return <div className="planetary-controls">
            <TabHeader>
                <PlanetaryStateComponent handler={this.props.handler} />
                <PlanetaryInfoComponent handler={this.props.handler} />
            </TabHeader>
            <TabBody>
                <PlanetaryUploadComponent handler={this.props.handler} />
                <RenderingInfo handler={this.props.handler} />
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
            let planet = handler.planets.get(handler.planetLock);
            if (!planet) return null;
            return <PlanetInfoComponent
                data={planet.data}
                onSubmit={(tag, value) => this.handleFieldUpdate(planet!.id, tag, value)}
            />
        } else if (handler.hoveredPlanets.size != 0) {
            let first = handler.hoveredPlanets.values().next();
            let planet = handler.planets.get(first.value);
            if (!planet) return null;
            return <PlanetInfoComponent
                data={planet.data}
                onSubmit={(tag, value) => this.handleFieldUpdate(planet!.id, tag, value)}
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
        // TODO: this must point to the right location!
        let url = new URL(window.location.href);
        url.port = "64209";
        url.protocol
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

class PlanetaryStateComponent extends React.Component<PlanetaryComponentProps> {
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
            <i className="fa fa-fast-backward" onClick={this.fb}/>
            <i className="fa fa-pause" onClick={this.pause}/>
            <i className="fa fa-play" onClick={this.play}/>
            <i className="fa fa-step-forward" onClick={this.sf}/>
            <i className="fa fa-fast-forward" onClick={this.ff}/>
        </div>;
    }
}

interface SystemInfoComponentProps {
    data: SystemData,
    onSubmit?: (tag: string, value: string) => void,
}
class SystemInfoComponent extends React.Component<SystemInfoComponentProps> {
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
class PlanetInfoComponent extends React.Component<PlanetInfoComponentProps> {
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