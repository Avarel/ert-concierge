import Chat from "./chat/index";
import Sidebar from "./sidebar/index";
import Window from "./window/index";

export { Chat, Sidebar, Window };

let chatWindowUI = new Window.UI(document.querySelector<HTMLElement>(".window#chat-window")!);
let controlWindowUI = new Window.UI(document.querySelector<HTMLElement>(".window#control-window")!);