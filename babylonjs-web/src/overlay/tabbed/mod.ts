import "./style.scss";
import TabbedComponent from "./components";
import React from "react";
import ReactDOM from "react-dom";

export module Tabbed {
    /** Tabbed entry. */
    export class Tab {
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
         * Construct a new Tab entry instance.
         * @param instance The parent instance. 
         * @param id The tab id.
         * @param label The tab label.
         */
        constructor(
            private readonly instance: Instance,
            readonly id: string,
            public label: string
        ) { }

        /** Is the tab active? */
        get isActive(): boolean {
            return this.instance.activeId == this.id;
        }

        /**
         * Get the HTML element and switch the mode
         * to HTML element mode.
         */
        get htmlElement(): HTMLDivElement | null {
            this.jsxContent = undefined;
            this.instance.renderToDOM();
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
                jsxContent: this.jsxContent,
                id: this.id,
                label: this.label,
                refobj: this.ref
            }
        }
    }

    /**
     * Convenient implementation for programmatically interacting with the
     * tabbed element and rendering it to the DOM or other React elements.
     */
    export class Instance {
        private readonly element?: HTMLElement;
        private readonly tabsMap: Map<string, Tab> = new Map();
        private component?: TabbedComponent;

        /**
         * Construct an icon sidebar instance.
         * @param selectorOrElement If a string (selector) is provided, it the 
         *          instance will bind to the first element that is 
         *          a descendant of node that matches selectors. Otherwise, it will
         *          assume that either `undefined` or an HTMLElement was passed in
         *          and bind to it instead.
         * @param contentHeight Fixed height of the tab instance. If undefined, then
         *          the tab element will be automatically sized.
         * @param reverseHeader Should the tab header be reversed?
         * @param initShow Should the tab instance be shown at first?
         */
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

        /** Get tabs. */
        get tabs(): ReadonlyMap<string, Tab> {
            return this.tabsMap;
        }

        /** Get the current active id. */
        get activeId(): string | undefined {
            return this.component?.activeId;
        }

        /**
         * Get a new tab.
         * @param id Tab id.
         * @param label Tab label.
         */
        addTab(id: string, label: string): Tab {
            const tab = new Tab(this, id, label);
            this.tabsMap.set(id, tab);
            this.renderToDOM();
            return tab;
        }

        /**
         * Get a tab by its id.
         * @param id Tab id.
         */
        getTab(id: string): Tab | undefined {
            return this.tabsMap.get(id);
        }

        /**
         * Remove a tab by its id.
         * @param id Tab id.
         */
        removeTab(id: string): boolean {
            const result = this.tabsMap.delete(id);
            if (this.component?.activeId == id) {
                this.component.activeId = undefined;
            }
            this.renderToDOM();
            return result;
        }

        /** Return JSX element of this instance. */
        render() {
            return React.createElement(TabbedComponent, {
                tabs: Array.from(this.tabsMap.values(), tab => tab.toProps()),
                contentHeight: this.contentHeight,
                reverseHeader: this.reverseHeader,
                initShow: this.initShow
            });
        }

        /** Render to the DOM if an element/selector is provided. */
        renderToDOM() {
            if (this.element) {
                this.component = ReactDOM.render(this.render(), this.element)
            }
        }
    }
}

export default Tabbed;