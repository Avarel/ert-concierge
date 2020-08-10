import IconSidebarComponent from "./components";
import React from "react";
import ReactDOM from "react-dom";

/** An icon sidebar that's similar to Discord's sidebar. */
export module IconSidebar {
    /** Icon entry for the sidebar. */
    export class Icon {
        /** CSS of the color generated based on the id. */
        readonly colorCss: string;

        /**
         * Construct a new icon entry.
         * @param id ID of the icon.
         * @param label 
         * @param imgSrc 
         */
        constructor(
            readonly id: string,
            public label: string,
            public imgSrc?: string
        ) {
            this.colorCss = Icon.makeHSLColor(this.id);
        }

        private static hashString(str: string): number {
            let hash = 0, i, chr;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }

        private static makeHSLColor(str: string): string {
            const rand = Icon.hashString(str) % 360;
            return `hsl(${rand}, 100%, 25%)`;
        }

        /** Turn the entry into props for rendering. */
        toProps() {
            return {
                id: this.id,
                label: this.label,
                colorCss: this.colorCss,
                imgSrc: this.imgSrc
            }
        }
    }

    /**
     * Convenient implementation for programmatically interacting with the
     * icon sidebar element and rendering it to the DOM or other React elements.
     */
    export class Instance {
        private readonly element?: HTMLElement;
        private readonly iconsMap: Map<string, Icon> = new Map();
        private component?: IconSidebarComponent;

        /**
         * Construct an icon sidebar instance.
         * @param selectorOrElement If a string (selector) is provided, it the 
         *          instance will bind to the first element that is 
         *          a descendant of node that matches selectors. Otherwise, it will
         *          assume that either `undefined` or an HTMLElement was passed in
         *          and bind to it instead.
         */
        constructor(
            selectorOrElement?: string | HTMLElement,
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
            this.renderToDOM();
            return icon;
        }

        /** Clear all icon entries. */
        clear() {
            this.iconsMap.clear();
            this.renderToDOM();
        }

        /**
         * Get an icon based on its id.
         * @param id Icon id.
         */
        getIcon(id: string): Icon | undefined {
            return this.iconsMap.get(id);
        }

        /**
         * Remove an icon based on its id.
         * @param id Icon id.
         */
        removeIcon(id: string): boolean {
            const result = this.iconsMap.delete(id);
            this.renderToDOM();
            return result;
        }

        /** Return JSX element of this instance. */
        render() {
            return React.createElement(IconSidebarComponent, {
                icons: Array.from(this.iconsMap.values(), icon => icon.toProps()),
            });
        }

        /** Render to the DOM if an element/selector is provided. */
        renderToDOM() {
            if (this.element) {
                this.component = ReactDOM.render(this.render(), this.element);
            }
        }
    }
}

export default IconSidebar;