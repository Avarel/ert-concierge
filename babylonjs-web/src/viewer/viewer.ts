import "./viewer.scss";

import * as ConciergeAPI from "../concierge_api/mod";
import { PhysicsHandler } from "./sims/physics_handler";
import { ChatHandler } from "./chat_handler";
import { PlanetsHandler } from "./sims/planetary_sim/planets_handler";
import { UsersHandler } from "./users_handler";
import { Renderer } from "./renderer";
import { Chat, Sidebar, Window } from "../overlay/mod";

const queries = new URLSearchParams(window.location.search);

// http://localhost:8080/?server=ws%3A%2F%2Fcompute-cpu2.cms.caltech.edu%3A64209%2Fws&name=Anthony
// http://localhost:8080/?server=ws%3A%2F%2F127.0.0.1%3A64209%2Fws&name=Anthony
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

export let chatWindowUI = new Window.UI(document.querySelector<HTMLElement>(".window#chat-window")!);
export let controlWindowUI = new Window.UI(document.querySelector<HTMLElement>(".window#control-window")!);

let client = new ConciergeAPI.Client(name, serverURL, true);

// simulations
let physicsHandler = new PhysicsHandler(client, renderer);
client.handlers.push(physicsHandler);

let planetHandler = new PlanetsHandler(client, renderer);
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

client.connect("0.1.0");
