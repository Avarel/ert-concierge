import "./viewer.scss";

import * as ConciergeAPI from "../concierge_api/mod";
import { PhysicsHandler } from "./sims/physics_sim/physics_handler";
import { ChatHandler } from "./chat_handler";
import { PlanetsHandler } from "./sims/planetary_sim/planets_handler";
import { UsersHandler } from "./users/users_handler";
import { Renderer } from "./renderer";
import { Sidebar, Views } from "../overlay/mod";

import React from "react";
import ReactDOM from "react-dom";
import { About } from "./about";
import Tabbed from "../overlay/tabbed/react";
import { GroupsHandler } from "./groups/groups_handler";

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
        // const leftTabComponentRef = React.createRef<Tabbed.Component>();
        // const rightTabComponentRef = React.createRef<Tabbed.Component>();
        // const sidebarComponentRef = React.createRef<Sidebar.Component>();

        // ReactDOM.render(
        //     <React.Fragment>
        //         <div><Sidebar.Component ref={sidebarComponentRef} /></div>
        //         <div className="float-window left">
        //             <Tabbed.Component ref={leftTabComponentRef} contentHeight={500} />
        //         </div>
        //         <div className="float-window right tall">
        //             <Tabbed.Component ref={rightTabComponentRef} contentHeight={800} reverseHeader>
        //                 <Tabbed.StaticTab tag="about" name="About">
        //                     <About />
        //                 </Tabbed.StaticTab>
        //             </Tabbed.Component>
        //         </div>
        //         <div className="views"></div>
        //     </React.Fragment>,
        //     document.querySelector(".app")
        // );

        // const leftTabComponent = leftTabComponentRef.current!;
        // const rightTabComponent = rightTabComponentRef.current!;
        // const sidebarComponent = sidebarComponentRef.current!;

        const leftTabComponent = ReactDOM.render(
            React.createElement(Tabbed.Component, { contentHeight: 500 }),
            document.getElementById("left-controls")
        );
        const rightTabComponent = ReactDOM.render(
            React.createElement(Tabbed.Component, { contentHeight: 800, reverseHeader: true }),
            document.getElementById("right-controls")
        );
        rightTabComponent.addTab("about", "About").reactContent = React.createElement(About);
        const sidebarComponent = ReactDOM.render(
            React.createElement(Sidebar.Component),
            document.getElementById("sidebar-app")
        );

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
        rendererView.universalCamera();
        // rendererView.setCamera(rendererView.universalCamera())
        // rendererView.setCamera(rendererView.universalCamera())
        // let rendererView2 = renderer.createView(canvas2);

        // // simulations
        let physicsHandler = new PhysicsHandler(client, rendererView, rightTabComponent);
        client.handlers.push(physicsHandler);

        let planetHandler = new PlanetsHandler(client, rendererView, rightTabComponent);
        client.handlers.push(planetHandler);

        // chat
        let chatHandler = new ChatHandler(client, leftTabComponent);
        client.handlers.push(chatHandler);

        // users sidebar
        let userHandler = new UsersHandler(client, sidebarComponent, leftTabComponent);
        client.handlers.push(userHandler);

        // users sidebar
        let groupHandler = new GroupsHandler(client, leftTabComponent);
        client.handlers.push(groupHandler);

        renderer.start();

        client.connect("0.1.1");
    }
}

Viewer.start()