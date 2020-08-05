import "./viewer.scss";

import * as ConciergeAPI from "../concierge_api/mod";
import { PhysicsHandler } from "./sims/physics_sim/physics_handler";
import { ChatHandler } from "./chat_handler";
import { PlanetsHandler } from "./sims/planetary_sim/planets_handler";
import { UsersHandler } from "./users_handler";
import { Renderer } from "./renderer";
import { Chat, Sidebar, Drawer, Views } from "../overlay/mod";

import React from "react";
import ReactDOM from "react-dom";
import { About } from "./about";

export namespace Viewer {
    let leftDrawerUI = new Drawer.UI(document.querySelector<HTMLElement>(".window#chat-window")!);
    let rightDrawerUI = new Drawer.UI(document.querySelector<HTMLElement>(".window#control-window")!);

    rightDrawerUI.addTab("about", "About", tab => {
        ReactDOM.render(
            React.createElement(About),
            tab.bodyElement
        )
    });
    rightDrawerUI.showTab("about");

    export function start() {
        const queries = new URLSearchParams(window.location.search);

        let serverURL = queries.get("server") || prompt("Enter the server address.", "ws://127.0.0.1:64209/ws");
        if (!serverURL || serverURL.length == 0) {
            throw alert("Malformed server address!");
        }

        let name = queries.get("name") || prompt("Enter a username.");
        if (!name || name.length == 0) {
            throw alert("Malformed username!")
        }

        // Setup the main view.
        let viewManager = new Views.UI(".views");

        let view = viewManager.addView("main");
        let canvas = document.createElement("canvas");
        canvas.classList.add("renderCanvas");
        view.element.appendChild(canvas);

        // let view2 = viewManager.addView("main1");
        // let canvas2 = document.createElement("canvas");
        // canvas2.classList.add("renderCanvas");
        // view2.element.appendChild(canvas2);

        // setup the renderer;
        let renderer = new Renderer();

        let client = new ConciergeAPI.Client(name, serverURL, true);

        let rendererView = renderer.createView(canvas);
        // let rendererView2 = renderer.createView(canvas2);

        // simulations
        let physicsHandler = new PhysicsHandler(client, rendererView, rightDrawerUI);
        client.handlers.push(physicsHandler);

        let planetHandler = new PlanetsHandler(client, rendererView, rightDrawerUI);
        client.handlers.push(planetHandler);

        // chat
        let chatUI = new Chat.UI("#chat");
        let chatHandler = new ChatHandler(client, chatUI);
        client.handlers.push(chatHandler);

        // users
        let sidebarUI = new Sidebar.UI(document.querySelector<HTMLElement>(".sidebar#users")!);
        let userHandler = new UsersHandler(client, sidebarUI);
        client.handlers.push(userHandler);

        renderer.start();

        client.connect("0.1.1");
    }
}

Viewer.start()