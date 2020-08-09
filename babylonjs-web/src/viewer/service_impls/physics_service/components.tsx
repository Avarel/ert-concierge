import { RustPhysicsService } from "./mod";
import React from "react";
import Rs from "../../../overlay/rstyle/components";

interface PhysicsComponentProp {
    handler: RustPhysicsService
}
export class PhysicsComponent extends React.Component<PhysicsComponentProp> {
    handleRespawn() {
        this.props.handler.sendToService({
            type: "SPAWN_ENTITY"
        });
    }

    render() {
        return <div className="rstyled full">
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
        </div>;
    }
}