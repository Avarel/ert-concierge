import "./index.scss";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

export namespace Sidebar {
    export interface Icon {
        name: string,
        element: HTMLElement
    }

    export class UI {
        rootElement: HTMLElement;
        icons: Icon[] = [];

        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
        }

        private baseIcon(): HTMLDivElement {
            return createElement("div", ["icon"]);
        }

        clear() {
            for (let icon of this.icons) {
                icon.element.remove();
            }
            this.icons.length = 0;
        }

        addImageIcon(name: string, link: string) {
            let iconDiv = this.baseIcon();

            iconDiv.setAttribute("data-tippy-content", name);

            let imgElement = createElement("img");
            imgElement.setAttribute("src", link);
            iconDiv.appendChild(imgElement);

            // let tooltipElement = createElement("div", ["tooltip"]);
            // tooltipElement.innerText = name;
            // iconDiv.append(tooltipElement);

            this.rootElement.appendChild(iconDiv);
            this.icons.push({ name, element: iconDiv });
        }

        addInitialIcon(name: string, text: string) {
            let iconDiv = this.baseIcon();

            tippy(iconDiv, {
                placement: "right",
                content: name
            });

            let pElement = createElement("p");
            pElement.innerText = text.toUpperCase();
            iconDiv.appendChild(pElement);

            // let tooltipElement = createElement("div", ["tooltip"]);
            // tooltipElement.innerText = name;
            // iconDiv.append(tooltipElement);

            this.rootElement.appendChild(iconDiv);
            this.icons.push({ name, element: iconDiv });
        }

        removeIcon(name: string) {
            for (let i = 0; i < this.icons.length; i++) {
                let icon = this.icons[i];
                if (icon.name == name) {
                    icon.element.remove();
                    this.icons.splice(i, 1);
                }
            }
        }
    }
}

export default Sidebar;