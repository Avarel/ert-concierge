import React from "react";
import Rs from "../overlay/rstyle/components";

export function About() {
    return <div className="rstyled full">
        <Rs.Pad light>
            <h1>ERT Concierge</h1>
            <h2>BabylonJS Client</h2>
        </Rs.Pad>
        <Rs.Pad style={{flexGrow: 1}}>
            <Rs.Row>
                <Rs.Card>
                    <h2>Intern</h2>
                    <p>An Tran</p>
                </Rs.Card>
                <Rs.Card>
                    <h2>Mentor</h2>
                    <p>Santiago Lombeyda</p>
                </Rs.Card>
            </Rs.Row>
            <Rs.Card>
                <h2>Front-End</h2>
                <p>Pug/SCSS/TypeScript</p>
                <p>Webpack + ReactJS</p>
            </Rs.Card>
            <Rs.Card>
                <h2>Back-End</h2>
                <p>Rust</p>
            </Rs.Card>
        </Rs.Pad>
        <Rs.Pad light>
            <p>SURF 2020 / OVRAS</p>
        </Rs.Pad>
    </div>
}