import "./style.scss";
import React from "react";
import { ViewsReact } from "./react";
import ReactDOM from "react-dom";

export function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

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
            this.instance.render();
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
        private readonly element: HTMLElement;
        private readonly viewsMap: Map<string, View> = new Map();
        component?: ViewsReact.Component;

        constructor(rootElement: HTMLElement | string, private enableSplit: boolean = false) {
            if (rootElement == undefined) {
                throw new Error("Root element must not be null!");
            } else if (typeof rootElement == "string") {
                let element = document.querySelector<HTMLElement>(rootElement);
                if (!element) {
                    throw new Error("Query selector " + rootElement + " return null!");
                }
                this.element = element;
            } else {
                this.element = rootElement;
            }
        }

        addView(id: string): View {
            let view = new View(this, id);
            this.viewsMap.set(id, view);
            this.render();
            return view;
        }

        removeView(id: string) {
            this.viewsMap.delete(id);
            this.render();
        }

        render() {
            this.component = ReactDOM.render(
                React.createElement(ViewsReact.Component, {
                    views: Array.from(this.viewsMap.values(), view => view.toProps()),
                }),
                this.element
            )
        }
    }
}

export default Views;