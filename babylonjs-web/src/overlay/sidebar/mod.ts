import "./style.scss";
import tippy, { Props, Instance } from "tippy.js";
import "tippy.js/dist/tippy.css";

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

export module Sidebar {
    export class Icon {
        name: string;
        private element: HTMLElement;
        private tooltip: Instance<Props>;

        constructor(name: string, element: HTMLElement, tooltip: Instance<Props>) {
            this.name = name;
            this.element = element;
            this.tooltip = tooltip;
        }

        /**
         * Destroys the icon element.
         */
        destroy() {
            this.element.remove();
            this.tooltip.destroy();
        }
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

        /**
         * Clear all icons in the sidebar.
         */
        clear() {
            for (let icon of this.icons) {
                icon.destroy();
            }
            this.icons.length = 0;
        }

        /**
         * Add an image-based icon to the sidebar.
         * @param name The full name of the icon.
         * @param link The source link of the image.
         */
        addImageIcon(name: string, link: string) {
            let iconDiv = this.baseIcon();

            let tooltip = tippy(iconDiv, {
                placement: "right",
                content: name
            });

            let imgElement = createElement("img");
            imgElement.setAttribute("src", link);
            iconDiv.appendChild(imgElement);

            // let tooltipElement = createElement("div", ["tooltip"]);
            // tooltipElement.innerText = name;
            // iconDiv.append(tooltipElement);

            this.rootElement.appendChild(iconDiv);
            this.icons.push(new Icon(name, iconDiv, tooltip));
        }

        /**
         * Add a text-based icon to the sidebar.
         * @param name The full name of the icon.
         * @param text The text of the icon.
         */
        addInitialIcon(name: string, text: string) {
            let iconDiv = this.baseIcon();

            let tooltip = tippy(iconDiv, {
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
            this.icons.push(new Icon(name, iconDiv, tooltip));
        }

        /**
         * Remove an icon with the name.
         * @param name The name of the icon to remove.
         */
        removeIcon(name: string) {
            for (let i = 0; i < this.icons.length; i++) {
                let icon = this.icons[i];
                if (icon.name == name) {
                    icon.destroy();
                    this.icons.splice(i, 1);
                }
            }
        }
    }
}

export default Sidebar;