import "./viewer.scss";

import * as ConciergeAPI from "../concierge_api/mod";
import { PhysicsHandler } from "./sims/physics_sim/physics_handler";
import { ChatHandler } from "./chat_handler";
import { PlanetsHandler } from "./sims/planetary_sim/planets_handler";
import { UsersHandler } from "./users_handler";
import { Renderer } from "./renderer";
import { Sidebar, Views, Chat } from "../overlay/mod";

import React from "react";
import ReactDOM from "react-dom";
import { About } from "./about";
import Tabbed from "../overlay/tabbed/react";

export namespace Viewer {
    export function start() {
        const queries = new URLSearchParams(window.location.search);

        let serverURL = queries.get("server");
        if (!serverURL || serverURL.length == 0) {
            return;
        }

        let name = queries.get("name");
        if (!name || name.length == 0) {
            return;
        }

        setup(serverURL, name);
    }

    function setup(serverURL: string, name: string) {
        let leftTabComponentRef = React.createRef<Tabbed.Component>();
        let rightTabComponentRef = React.createRef<Tabbed.Component>();
        let chatComponentRef = React.createRef<Chat.Component>();
        let sidebarComponentRef = React.createRef<Sidebar.Component>();

        ReactDOM.render(
            <React.Fragment>
                <Sidebar.Component ref={sidebarComponentRef} />
                <div className="float-window left">
                    <Tabbed.Component ref={leftTabComponentRef} contentHeight={500}>
                        <Tabbed.StaticTab tag="chat" name="Chat">
                            <Chat.Component ref={chatComponentRef} />
                        </Tabbed.StaticTab>
                    </Tabbed.Component>
                </div>
                <div className="float-window right tall">
                    <Tabbed.Component ref={rightTabComponentRef} contentHeight={800} reverseHeader>
                        <Tabbed.StaticTab tag="about" name="About">
                            <About />
                        </Tabbed.StaticTab>
                    </Tabbed.Component>
                </div>
                <div className="views"></div>
            </React.Fragment>,
            document.querySelector(".app")
        );

        let leftTabComponent = leftTabComponentRef.current!;
        let rightTabComponent = rightTabComponentRef.current!;
        let chatComponent = chatComponentRef.current!;
        let sidebarComponent = sidebarComponentRef.current!;

        // Setup the main view.
        let viewManager = new Views.UI(".views");

        let view = viewManager.addView("main");
        let canvas = document.createElement("canvas");
        view.element.appendChild(canvas);

        // let view2 = viewManager.addView("main2");
        // let canvas2 = document.createElement("canvas");
        // view2.element.appendChild(canvas2);

        // setup the renderer;
        let renderer = new Renderer();

        let client = new ConciergeAPI.Client(name, serverURL, true);

        let rendererView = renderer.createView(canvas);
        // let rendererView2 = renderer.createView(canvas2);

        // // simulations
        let physicsHandler = new PhysicsHandler(client, rendererView, rightTabComponent);
        client.handlers.push(physicsHandler);

        let planetHandler = new PlanetsHandler(client, rendererView, rightTabComponent);
        client.handlers.push(planetHandler);

        // chat
        let chatHandler = new ChatHandler(client, chatComponent);
        client.handlers.push(chatHandler);

        // users sidebar
        let userHandler = new UsersHandler(client, sidebarComponent);
        client.handlers.push(userHandler);

        renderer.start();

        client.connect("0.1.1");
    }
}

Viewer.start()