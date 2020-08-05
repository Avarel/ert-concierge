import { PhysicsHandler } from "./physics_handler";
import ReactDOM from "react-dom";
import React from "react";
import Rs from "../../../overlay/rstyle/react";

export function renderController(handler: PhysicsHandler, element: HTMLElement) {
    ReactDOM.render(
        <PhysicsComponent handler={handler}/>,
        element
    );
}

interface PhysicsComponentProp {
    handler: PhysicsHandler
}
export class PhysicsComponent extends React.Component<PhysicsComponentProp> {
    handleRespawn() {
        this.props.handler.sendToSim({
            type: "SPAWN_ENTITY"
        });
    }

    render() {
        return <React.Fragment>
            <Rs.Pad light>
                <h1>Rust Physics</h1>
                <p>Hypercasual Game</p>
                <button onClick={() => this.handleRespawn()}>Respawn</button>
            </Rs.Pad>
            <Rs.Pad style={{flexGrow: 1}}>
                <Rs.Card>
                    <h2>Instructions</h2>
                    <p>Click on your own box colors to duplicate it.</p>
                    <p>Click on boxes with another color to destroy them.</p>
                </Rs.Card>
                <Rs.Card>
                    <p>Simulation written in Rust with Specs + Serde.</p>
                </Rs.Card>
            </Rs.Pad>
            <Rs.Pad light>
                <p>SURF 2020 / OVRAS</p>
            </Rs.Pad>
        </React.Fragment>;
    }
}