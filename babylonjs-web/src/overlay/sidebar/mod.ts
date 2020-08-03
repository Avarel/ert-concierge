import "./style.scss";
import tippy, { Props, Instance } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { createElement } from "../mod";

export module Sidebar {
    export class Icon {
        constructor(
            public id: string,
            private element: HTMLElement,
            private tooltip: Instance<Props>
        ) { }

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

        static hashString(str: string): number {
            var hash = 0, i, chr;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
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
        addImageIcon(id: string, name: string, link: string) {
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
            this.icons.push(new Icon(id, iconDiv, tooltip));
        }

        /**
         * Add a text-based icon to the sidebar.
         * @param name The full name of the icon.
         * @param text The text of the icon.
         */
        addInitialIcon(id: string, name: string, text: string) {
            let iconDiv = this.baseIcon();

            let tooltip = tippy(iconDiv, {
                placement: "right",
                content: name
            });

            let pElement = createElement("p");
            pElement.innerText = text.toUpperCase();
            iconDiv.appendChild(pElement);

            let rand = UI.hashString(name) % 360;
            pElement.style.backgroundColor = `hsl(${rand}, 100%, 25%)`;

            // let tooltipElement = createElement("div", ["tooltip"]);
            // tooltipElement.innerText = name;
            // iconDiv.append(tooltipElement);

            this.rootElement.appendChild(iconDiv);
            this.icons.push(new Icon(id, iconDiv, tooltip));
        }

        /**
         * Remove an icon with the name.
         * @param name The name of the icon to remove.
         */
        removeIcon(id: string) {
            for (let i = 0; i < this.icons.length; i++) {
                let icon = this.icons[i];
                if (icon.id == id) {
                    icon.destroy();
                    this.icons.splice(i, 1);
                }
            }
        }
    }
}

export default Sidebar;