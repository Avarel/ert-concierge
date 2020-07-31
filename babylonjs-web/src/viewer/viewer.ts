import "./viewer.scss";

import * as ConciergeAPI from "../concierge_api/mod";
import { PhysicsHandler } from "./sims/physics_handler";
import { ChatHandler } from "./chat_handler";
import { PlanetsHandler } from "./sims/planetary_sim/planets_handler";
import { UsersHandler } from "./users_handler";
import { Renderer } from "./renderer";
import { Chat, Sidebar, Drawer } from "../overlay/mod";

export namespace Viewer {
    let leftDrawerUI = new Drawer.UI(document.querySelector<HTMLElement>(".window#chat-window")!);
    let rightDrawerUI = new Drawer.UI(document.querySelector<HTMLElement>(".window#control-window")!);

    rightDrawerUI.addTab("about", "About", (tab) => {
        tab.addHeader((header) => {
            header.addH1("ERT Concierge / BabylonJS Front-end");
            header.addP("SURF 2020 / OVRAS");
        });
        tab.addBody((body) => {
            body.addBox((box) => {
                box.addH1("An Tran");
                box.addP("Intern");
            });
            body.addBox((box) => {
                box.addH1("Santiago Lombeyda");
                box.addP("Mentor");
            });
            body.addBox((box) => {
                box.addH1("Front-end");
                box.addP("Pug/SCSS/TypeScript + Webpack");
            });
            body.addBox((box) => {
                box.addH1("Back=end");
                box.addP("Rust");
            });
        });
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
    
        let canvas = document.querySelector<HTMLCanvasElement>("canvas#renderCanvas");
        if (!canvas) {
            throw "Canvas is not found!";
        }
        canvas.focus();
        let renderer = new Renderer(canvas);
    
        let client = new ConciergeAPI.Client(name, serverURL, true);

        
    
        // simulations
        let physicsHandler = new PhysicsHandler(client, renderer);
        client.handlers.push(physicsHandler);
    
        let planetHandler = new PlanetsHandler(client, renderer, rightDrawerUI);
        client.handlers.push(planetHandler);
    
        // chat
        let chatUI = new Chat.UI(document.querySelector<HTMLElement>("#chat")!);
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