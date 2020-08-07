import "./viewer.scss";

import * as ConciergeAPI from "../concierge_api/mod";
import { PhysicsHandler } from "./sims/physics_sim/physics_handler";
import { ChatHandler } from "./chat_handler";
import { PlanetsHandler } from "./sims/planetary_sim/planets_handler";
import { UsersHandler } from "./users/users_handler";
import { Renderer } from "./renderer";
import { IconSidebar, Views, Tabbed } from "../overlay/mod";

import React from "react";
import { About } from "./about";
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
        const leftTabComponent = new Tabbed.Instance("#left-controls", 500);
        const rightTabComponent = new Tabbed.Instance("#right-controls", 800, true);
        rightTabComponent.addTab("about", "About").reactContent = React.createElement(About);
        const sidebarComponent = new IconSidebar.Instance("#sidebar-app");
        const viewManager = new Views.Instance("#views");

        let view = viewManager.addView("main");
        viewManager.render();
        let canvas = document.createElement("canvas");
        view.htmlElement!.appendChild(canvas);

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