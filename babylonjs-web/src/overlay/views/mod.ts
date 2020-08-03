import "./style.scss";
import { createElement } from "../mod";
import Split from "split.js";

export namespace Views {
    export interface View {
        id: string,
        element: HTMLElement,
    }

    export class UI {
        views: Map<string, View>;
        split?: Split.Instance;
        rootElement: HTMLElement;

        constructor(rootElement: HTMLElement | string, private enableSplit: boolean = false) {
            if (rootElement == undefined) {
                throw new Error("Root element must not be null!");
            } else if (typeof rootElement == "string") {
                let element = document.querySelector<HTMLElement>(rootElement);
                if (!element) {
                    throw new Error("Query selector " + rootElement + " return null!");
                }
                this.rootElement = element;
            } else {
                this.rootElement = rootElement;
            }
            this.views = new Map();
        }
        
        unsetSplit() {
            if (!this.enableSplit) return;
            
            this.split?.destroy();
        }

        setSplit() {
            if (!this.enableSplit) return;
            
            let viewElements = [];
            for (const value of this.views.values()) {
                viewElements.push(value.element);
            }
            this.split = Split(viewElements, {
                direction: 'horizontal',
                // sizes: [50, 50],
                gutterSize: 10,
                minSize: 300
            });
        }

        addView(id: string): View {
            this.unsetSplit();
            if (this.views.has(id)) {
                throw new Error("View " + id + " already exists!");
            }
            let element = createElement("div", ["view"])
            this.rootElement.appendChild(element);
            let view = { id, element };
            this.views.set(id, view);
            this.setSplit();
            return view;
        }

        removeView(id: string) {
            this.unsetSplit();
            let view = this.views.get(id);
            if (view) {
                view.element.remove();
                this.views.delete(id);
            }
            this.setSplit();
        }
    }
}

export default Views;