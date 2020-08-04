import "./style.scss";
// import tippy, { Props, Instance } from "tippy.js";
// import "tippy.js/dist/tippy.css";
import { SidebarComponent } from "./react";
import ReactDOM from "react-dom";
import React from "react";

export module Sidebar {
    interface Icon<T extends string> {
        type: T,
        id: string,
        name: string,
    }

    interface ImageIcon extends Icon<"IMAGE"> {
        imgSrc: string
    }
    
    interface TextIcon extends Icon<"TEXT"> {
        colorCss: string
    }

    type SidebarItem = TextIcon | ImageIcon;

    export class UI {
        rootElement: HTMLElement;
        items: Map<string, SidebarItem> = new Map();

        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
            this.render();
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

        render() {
            ReactDOM.render(
                React.createElement(SidebarComponent, { items: Array.from(this.items.values()) }),
                this.rootElement
            );
        }

        /**
         * Clear all icons in the sidebar.
         */
        clear() {
            this.items.clear();
        }

        /**
         * Add an image-based icon to the sidebar.
         * @param name The full name of the icon.
         * @param imgSrc The source link of the image.
         */
        addImageIcon(id: string, name: string, imgSrc: string) {
            this.items.set(id, {
                type: "IMAGE",
                id,
                name,
                imgSrc
            });
            this.render();
        }

        /**
         * Add a text-based icon to the sidebar.
         * @param name The full name of the icon.
         * @param text The text of the icon.
         */
        addInitialIcon(id: string, name: string, text: string) {
            let rand = UI.hashString(name) % 360;
            let colorCss = `hsl(${rand}, 100%, 25%)`;

            this.items.set(id, {
                type: "TEXT",
                id,
                name,
                colorCss
            });
            this.render();
        }

        /**
         * Remove an icon with the name.
         * @param name The name of the icon to remove.
         */
        removeIcon(id: string) {
            this.items.delete(id);
            this.render();
        }
    }
}

export default Sidebar;