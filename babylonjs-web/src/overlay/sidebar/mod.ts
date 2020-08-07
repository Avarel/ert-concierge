import IconSidebarReact from "./react";
import React from "react";
import ReactDOM from "react-dom";

export module IconSidebar {
    export class Icon {
        readonly colorCss: string;
        
        constructor(
            readonly id: string, 
            public label: string,
            public imgSrc?: string
        ) {
            this.colorCss = Icon.makeHSLColor(this.label);
        }

        private static hashString(str: string): number {
            var hash = 0, i, chr;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }

        private static makeHSLColor(str: string): string {
            let rand = Icon.hashString(str) % 360;
            return `hsl(${rand}, 100%, 25%)`;
        }
        
        toProps() {
            return {
                id: this.id,
                label: this.label,
                colorCss: this.colorCss,
                imgSrc: this.imgSrc
            }
        }
    }

    export class Instance {
        private readonly element: HTMLElement;
        private readonly iconsMap: Map<string, Icon> = new Map();
        component?: IconSidebarReact.Component;

        constructor(
            selectorOrElement: string | HTMLElement,
        ) {
            if (typeof selectorOrElement == "string") {
                const element = document.querySelector<HTMLElement>(selectorOrElement);
                if (!element) {
                    throw new Error(`Can not insantiate Tabbed on an undefined element.`);
                }
                this.element = element;
            } else {
                this.element = selectorOrElement;
            }
        }

        /**
         * Add an image-based icon to the sidebar.
         * @param id The id of the icon.
         * @param label The full name of the icon.
         * @param imgSrc The image source of the icon.
         */
        addIcon(id: string, label: string, imgSrc?: string): Icon {
            const icon = new Icon(id, label, imgSrc);
            this.iconsMap.set(id, icon);
            this.render();
            return icon;
        }

        clear() {
            this.iconsMap.clear();
            this.render();
        }

        getIcon(id: string): Icon | undefined {
            return this.iconsMap.get(id);
        }

        removeIcon(id: string): boolean {
            const result = this.iconsMap.delete(id);
            this.render();
            return result;
        }
    
        render() {
            this.component = ReactDOM.render(
                React.createElement(IconSidebarReact.Component, {
                    icons: Array.from(this.iconsMap.values(), icon => icon.toProps()),
                }),
                this.element
            )
        }
    }
}

export default IconSidebar;