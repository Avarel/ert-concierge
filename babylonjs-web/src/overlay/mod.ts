import Chat from "./chat/mod";
import Sidebar from "./sidebar/mod";
import Drawer from "./window/mod";
import Views from "./views/mod"

export function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

export { Chat, Sidebar, Drawer, Views };