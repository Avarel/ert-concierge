import "./style.scss";
import ViewsComponent from "./components";
import React from "react";
import ReactDOM from "react-dom";

export namespace Views {
    export class View {
        private jsxContent?: JSX.Element | null = null;
        private readonly ref = React.createRef<HTMLDivElement>();

        constructor(
            private readonly instance: Instance,
            readonly id: string,
        ) { }

        get htmlElement(): HTMLDivElement | null {
            this.jsxContent = undefined;
            return this.ref.current;
        }

        set reactContent(content: JSX.Element) {
            this.jsxContent = content;
            this.instance.renderToDOM();
        }

        toProps() {
            console.log("refz", this.ref);
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

        addView(id: string): View {
            const view = new View(this, id);
            this.viewsMap.set(id, view);
            this.renderToDOM();
            return view;
        }

        removeView(id: string) {
            this.viewsMap.delete(id);
            this.renderToDOM();
        }

        render() {
            return React.createElement(ViewsComponent, {
                views: Array.from(this.viewsMap.values(), view => view.toProps()),
            });
        }

        renderToDOM() {
            if (this.element) {
                this.component = ReactDOM.render(this.render(), this.element);
            }
        }
    }
}

export default Views;