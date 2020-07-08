import { Renderer } from "./renderer";
import * as ConciergeAPI from "./concierge_api";
import { PhysicsHandler } from "./physics_handler";
import { ChatHandler } from "./chat_handler";

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
let physicsHandler = new PhysicsHandler(client, renderer);
client.handlers.push(physicsHandler);

let chatHandler = new ChatHandler(client, renderer);
client.handlers.push(chatHandler);

renderer.start();

client.connect("0.1.0");
