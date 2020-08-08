import "./style.scss";
import TabbedComponent from "./components";
import React from "react";
import ReactDOM from "react-dom";

export module Tabbed {
    export class Tab {
        private jsxContent?: JSX.Element | null = null;
        private readonly ref = React.createRef<HTMLDivElement>();

        constructor(
            private readonly instance: Instance,
            readonly id: string,
            public label: string
        ) { }

        get isActive(): boolean {
            return this.instance.activeId == this.id;
        }

        get htmlElement(): HTMLDivElement | null {
            this.jsxContent = undefined;
            this.instance.renderToDOM();
            return this.ref.current;
        }

        set reactContent(content: JSX.Element) {
            this.jsxContent = content;
            this.instance.renderToDOM();
        }

        toProps() {
            return {
                jsxContent: this.jsxContent,
                id: this.id,
                label: this.label,
                refobj: this.ref
            }
        }
    }

    export class Instance {
        private readonly element?: HTMLElement;
        private readonly tabsMap: Map<string, Tab> = new Map();
        private component?: TabbedComponent;

        constructor(
            selectorOrElement: string | HTMLElement,
            public contentHeight?: number,
            public reverseHeader: boolean = false,
            private readonly initShow: boolean = false,
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

        get tabs(): ReadonlyMap<string, Tab> {
            return this.tabsMap;
        }

        get activeId(): string | undefined {
            return this.component?.activeId;
        }

        addTab(id: string, label: string): Tab {
            const tab = new Tab(this, id, label);
            this.tabsMap.set(id, tab);
            this.renderToDOM();
            return tab;
        }

        getTab(id: string): Tab | undefined {
            return this.tabsMap.get(id);
        }

        removeTab(id: string): boolean {
            const result = this.tabsMap.delete(id);
            if (this.component?.activeId == id) {
                this.component.activeId = undefined;
            }
            this.renderToDOM();
            return result;
        }

        private render() {
            return React.createElement(TabbedComponent, {
                tabs: Array.from(this.tabsMap.values(), tab => tab.toProps()),
                contentHeight: this.contentHeight,
                reverseHeader: this.reverseHeader,
                initShow: this.initShow
            });
        }

        renderToDOM() {
            if (this.element) {
                this.component = ReactDOM.render(this.render(), this.element)
            }
        }
    }
}

export default Tabbed;