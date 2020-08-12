import "./style.scss";
import ViewsComponent from "./components";
import React from "react";
import ReactDOM from "react-dom";

export namespace Views {
    /** View entry. */
    export class View {
        /** 
         * If the JSX element is `undefined`, then the element is in
         * HTML mode. This means that the tab is always rendered.
         * 
         * Otherwise, the tab is in React mode and is only rendered when
         * it is active.
         */
        private jsxContent?: JSX.Element | null = null;
        /** React reference to the HTML element if it is rendered. */
        private readonly ref = React.createRef<HTMLDivElement>();

        /**
         * Construct a new View entry instance.
         * @param instance The parent instance. 
         * @param id The view id.
         */
        constructor(
            private readonly instance: Instance,
            readonly id: string,
        ) { }

        /**
         * Get the HTML element and switch the mode
         * to HTML element mode.
         */
        get htmlElement(): HTMLDivElement | null {
            this.jsxContent = undefined;
            return this.ref.current;
        }

        /** Set the React JSX content. */
        set reactContent(content: JSX.Element) {
            this.jsxContent = content;
            this.instance.renderToDOM();
        }

        /** Turn the entry into props for rendering. */
        toProps() {
            return {
                id: this.id,
                jsxContent: this.jsxContent,
                refobj: this.ref
            }
        }
    }

    export class Instance {
        private readonly element?: HTMLElement;
        private readonly viewsMap: Map<string, View> = new Map();
        private component?: ViewsComponent;

        /**
         * Construct an icon sidebar instance.
         * @param selectorOrElement If a string (selector) is provided, it the 
         *          instance will bind to the first element that is 
         *          a descendant of node that matches selectors. Otherwise, it will
         *          assume that either `undefined` or an HTMLElement was passed in
         *          and bind to it instead.
         */
        constructor(selectorOrElement?: HTMLElement | string) {
            if (selectorOrElement == undefined) {
                throw new Error("Root element must not be null!");
            } else if (typeof selectorOrElement == "string") {
                const element = document.querySelector<HTMLElement>(selectorOrElement);
                if (!element) {
                    throw new Error("Query selector " + selectorOrElement + " return null!");
                }
                this.element = element;
            } else {
                this.element = selectorOrElement;
            }
        }

        /**
         * Add a new view.
         * @param id View id.
         */
        addView(id: string): View {
            const view = new View(this, id);
            this.viewsMap.set(id, view);
            this.renderToDOM();
            return view;
        }

        /**
         * Get a view by its id.
         * @param id View id.
         */
        getView(id: string): View | undefined {
            return this.viewsMap.get(id);
        }

        /**
         * Remove a view by its id.
         * @param id View id.
         */
        removeView(id: string) {
            this.viewsMap.delete(id);
            this.renderToDOM();
        }

        /** Return JSX element of this instance. */
        render() {
            return React.createElement(ViewsComponent, {
                views: Array.from(this.viewsMap.values(), view => view.toProps()),
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

export default Views;