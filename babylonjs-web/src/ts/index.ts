import { Renderer } from "./renderer";
import * as ConciergeAPI from "./concierge_api";
import { PhysicsHandler } from "./physics_handler";
import { ChatHandler } from "./chat_handler";
import { PlanetsHandler } from "./planets_handler";
import { Chat, Sidebar } from "./overlay";
import { UsersHandler } from "./users_handler";

let canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
if (!canvas) {
    throw "Canvas is not found!";
}
canvas.focus();

var url = prompt("Please enter the server address", "ws://127.0.0.1:64209/ws")

if (url == "debug") {
    let renderer = new Renderer(canvas);
    renderer.start();
    throw "Debug mode"
}

if (!url || url.length == 0) {
    throw alert("A server address is required, please restart the webpage.")
}

var person = prompt("Please enter your name", "anthony");
if (!person || person.length == 0) {
    throw alert("A valid name, please restart the webpage.")
}

let renderer = new Renderer(canvas);

let client = new ConciergeAPI.Client(person, url, true);

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
