import "./viewer.scss";

import Client from "../concierge_api/mod";
import { RustPhysicsService } from "./service_impls/physics_service/mod";
import { ChatService } from "./service_impls/chat_service";
import { PlanetaryService } from "./service_impls/planetary_service/mod";
import { ClientsHandler } from "./users/users_handler";
import { Renderer } from "./renderer";
import { IconSidebar, Views, Tabbed } from "../overlay/mod";
import { About } from "./about";
import { ServicesHandler } from "./services/services_handler";
import React from "react";

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
        viewManager.renderToDOM();
        let canvas = document.createElement("canvas");
        view.htmlElement!.appendChild(canvas);

        // Setup the BABYLON renderer
        let renderer = new Renderer();

        let client = new Client(name, serverURL, undefined, true);

        let rendererView = renderer.createView(canvas);
        rendererView.universalCamera();

        // Clients Tab
        let userHandler = new ClientsHandler(client, sidebarComponent, leftTabComponent);
        client.addHandler(userHandler);

        // Services Tab
        let servicesHandler = new ServicesHandler(client, leftTabComponent);
        client.addHandler(servicesHandler);
        servicesHandler.addService(new ChatService(client, leftTabComponent));
        servicesHandler.addService(new PlanetaryService(client, rendererView, rightTabComponent));
        servicesHandler.addService(new RustPhysicsService(client, rendererView, rightTabComponent));

        renderer.start();

        client.connect("0.2.0");
    }
}

Viewer.start()