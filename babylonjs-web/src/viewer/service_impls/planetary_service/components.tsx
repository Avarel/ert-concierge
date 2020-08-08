import { SystemData, SystemObject } from "./payloads";
import { PlanetaryService } from "./mod";
import Rs from "../../../overlay/rstyle/components";
import React from "react";

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
        return <Rs.Card>
            <h2>Rendering Statistics</h2>
            <Rs.InputValue label="FPS" inputs={[{ value: this.state.fps }]} />
            <Rs.InputValue label="Frame Delta" inputs={[{ value: `${this.state.fdelta}ms` }]} />
            <Rs.InputValue label="Planet Meshes" inputs={[{ value: this.state.pmeshes }]} />
        </Rs.Card>;
    }
}

interface PlanetaryComponentProps {
    handler: PlanetaryService
}
export class PlanetaryComponent extends React.Component<PlanetaryComponentProps> {
    render() {
        return <div className="planetary-controls rstyled full">
            <Rs.Pad light>
                <PlanetaryStateComponent handler={this.props.handler} />
                <PlanetaryInfoComponent handler={this.props.handler} />
            </Rs.Pad>
            <Rs.Pad>
                <PlanetaryUploadComponent handler={this.props.handler} />
                <RenderingInfo handler={this.props.handler} />
                <Rs.Card>
                    <h2>Planetary Simulation</h2>
                    <p>Python Simulation by Alison Noyes</p>
                    <p>BabylonJS Front-end by An Tran</p>
                </Rs.Card>
            </Rs.Pad>
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
        } else if (handler.sysData) {
            return <SystemInfoComponent
                data={handler.sysData}
                onSubmit={(tag, value) => this.handleFieldUpdate("system", tag, value)}
            />
        } else {
            return null;
        }
    }

    render() {
        return <Rs.Pad>
            {this.conditional()}
        </Rs.Pad>
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
        return <Rs.Card>
            <h2>Upload JSON System</h2>
            <p>Try out your own planetary systems!</p>
            <form className="planetary-upload" onSubmit={event => this.submitHandler(event)}>
                <input type="file" name="file" />
                <button type="submit">Submit</button>
            </form>
        </Rs.Card>
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
        return <Rs.Card>
            <Rs.Row id="icons">
                <i className="fa fa-fast-backward" onClick={this.fb} />
                <i className="fa fa-pause" onClick={this.pause} />
                <i className="fa fa-play" onClick={this.play} />
                <i className="fa fa-step-forward" onClick={this.sf} />
                <i className="fa fa-fast-forward" onClick={this.ff} />
            </Rs.Row>
        </Rs.Card>;
    }
}

interface SystemInfoComponentProps {
    data: SystemData,
    onSubmit?: (tag: string, value: string) => void,
}
class SystemInfoComponent extends React.Component<SystemInfoComponentProps> {
    render() {
        return <React.Fragment>
            <h1>SYSTEM</h1>
            <Rs.InputValue label="Gravity Constant" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "gravityConstant", value: this.props.data.gravityConstant }]}
            />
            <Rs.InputValue label="Scale" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "scale", value: this.props.data.scale }]}
            />
            <Rs.InputValue label="Time Scale" onSubmit={this.props.onSubmit}
                inputs={[{ value: this.props.data.timeScale }]}
            />
            <Rs.InputValue label="Body Scale" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "bodyScale", value: this.props.data.bodyScale }]}
            />
            <Rs.InputValue label="Central Body Scale" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "centralBodyScale", value: this.props.data.centralBodyScale }]}
            />
            <Rs.InputValue label="Elasticity" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "elasticity", value: this.props.data.elasticity }]}
            />
            <Rs.InputValue label="Central Body Name" onSubmit={this.props.onSubmit}
                inputs={[{ value: this.props.data.centralBodyName }]}
            />
            <Rs.InputValue label="Hand Mass" onSubmit={this.props.onSubmit}
                inputs={[{ value: this.props.data.handMass }]}
            />
            <Rs.InputValue label="Boundary" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "boundary", value: this.props.data.boundary }]}
            />
        </React.Fragment>;
    }
}

interface PlanetInfoComponentProps {
    data: SystemObject,
    onSubmit?: (tag: string, value: string) => void,
}
class PlanetInfoComponent extends React.Component<PlanetInfoComponentProps> {
    render() {
        return <React.Fragment>
            <h1>{this.props.data.name.toUpperCase()}</h1>
            <Rs.InputValue label="Mass" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "mass", value: this.props.data.mass }]}
            />
            <Rs.InputValue label="Radius" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "radius", value: this.props.data.radius }]}
            />
            <Rs.InputValue label="Location" onSubmit={this.props.onSubmit}
                inputs={[
                    { tag: "location[0]", value: this.props.data.location[0] },
                    { tag: "location[1]", value: this.props.data.location[1] },
                    { tag: "location[2]", value: this.props.data.location[2] }
                ]}
            />
            <Rs.InputValue label="Orbit Radius" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "orbitRadius", value: this.props.data.orbitRadius }]}
            />
            <Rs.InputValue label="Orbit Speed" onSubmit={this.props.onSubmit}
                inputs={[{ tag: "orbitSpeed", value: this.props.data.orbitSpeed }]}
            />
            <Rs.InputValue label="Location" onSubmit={this.props.onSubmit}
                inputs={[
                    { tag: "direction[0]", value: this.props.data.direction[0] },
                    { tag: "direction[1]", value: this.props.data.direction[1] },
                    { tag: "direction[2]", value: this.props.data.direction[2] }
                ]}
            />
        </React.Fragment>;
    }
}