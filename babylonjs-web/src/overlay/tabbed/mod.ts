import "./style.scss";
import React from "react";
import TabbedReact from "./react";
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
            return this.instance.component?.activeId == this.id;
        }

        get htmlElement(): HTMLDivElement | null {
            this.jsxContent = undefined;
            return this.ref.current;
        }

        set reactContent(content: JSX.Element) {
            this.jsxContent = content;
            this.instance.render();
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
        private readonly element: HTMLElement;
        private readonly tabsMap: Map<string, Tab> = new Map();
        component?: TabbedReact.Component;

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

        addTab(id: string, label: string): Tab {
            const tab = new Tab(this, id, label);
            this.tabsMap.set(id, tab);
            this.render();
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
            this.render();
            return result;
        }

        render() {
            this.component = ReactDOM.render(
                React.createElement(TabbedReact.Component, {
                    tabs: Array.from(this.tabsMap.values(), tab => tab.toProps()),
                    contentHeight: this.contentHeight,
                    reverseHeader: this.reverseHeader,
                    initShow: this.initShow
                }),
                this.element
            )
        }
    }
}

export default Tabbed;