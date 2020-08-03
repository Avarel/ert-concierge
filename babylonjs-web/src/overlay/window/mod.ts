import "./style.scss";
import { AbstractBody, Header, Body } from "./manager";
import { createElement } from "../mod";
export { createElement };

export module Drawer {
    export class Tab extends AbstractBody {
        readonly type = "TAB";

        constructor(
            public tag: string,
            private headerTabElement: HTMLElement,
            bodyElement: HTMLElement
        ) {
            super(undefined, bodyElement);
        }

        addHeader(callback?: (header: Header) => void): Header {
            return this.addChild(new Header(this), callback);
        }

        addBody(callback?: (header: Body) => void): Body {
            return this.addChild(new Body(this), callback);
        }

        show(flag: boolean = true) {
            if (flag) {
                this.headerTabElement.classList.add("active");
                this.bodyElement.classList.add("active");
            } else {
                this.headerTabElement.classList.remove("active");
                this.bodyElement.classList.remove("active");
            }
        }

        remove() {
            this.headerTabElement.remove();
            this.bodyElement.remove();
            super.remove();
        }
    }

    export class UI {
        headerElement: HTMLElement;
        drawerElement: HTMLElement;
        bodyElement: HTMLElement;
        tabs: Map<string, Tab> = new Map();

        constructor(public rootElement: HTMLElement) {
            this.rootElement = rootElement;
            this.headerElement = rootElement.querySelector<HTMLElement>(".window-header")
                || createElement("div", ["window-header"]);
            this.rootElement.prepend(this.headerElement);
            this.drawerElement = this.headerElement.querySelector(".window-drawer")
                || createElement("div", ["window-drawer"]);
            this.headerElement.prepend(this.drawerElement);

            this.drawerElement.addEventListener("click", () => {
                this.toggle();
            });

            this.bodyElement = rootElement.querySelector<HTMLElement>(".window-body")
                || createElement("div", ["window-body"]);
            this.rootElement.append(this.bodyElement);

            this.bodyElement.querySelectorAll<HTMLElement>(".window-tab").forEach((tabBody, i) => {
                let bodyTag = tabBody.getAttribute("tag");
                if (bodyTag) {
                    let label = tabBody.getAttribute("label") || bodyTag;
                    let tab = this.addPopulatedTab(bodyTag, label, tabBody);
                    tab.show(i == 0);
                }
            });
        }

        /** Add a populated tab. */
        addPopulatedTab(tag: string, label: string, tabBody: HTMLElement): Tab {
            if (this.tabs.has(tag)) {
                throw new Error("Tab " + tag + " already exists!");
            }

            const tabHeader = createElement("div", ["window-header-tab"]);
            tabHeader.innerText = label;
            this.headerElement.appendChild(tabHeader);
            this.bodyElement.appendChild(tabBody);

            const tab = new Tab(tag, tabHeader, tabBody);
            this.tabs.set(tag, tab);

            tabHeader.addEventListener("click", () => {
                this.show(true);
                this.showTab(tag!);
            });

            return tab;
        }

        /** Add an empty tab. */
        addTab(tag: string, label: string, callback: (tab: Tab) => void): Tab {
            if (this.tabs.has(tag)) {
                throw new Error("Tab " + tag + " already exists!");
            }
            
            const tabBody = createElement("div", ["window-tab"]);
            let tab = this.addPopulatedTab(tag, label, tabBody);

            callback?.(tab);

            return tab;
        }

        /** Remove the tab by its tag, and show the first remaining tab. */
        removeTab(tag: string) {
            let tab = this.tabs.get(tag);
            if (tab) {
                tab.remove();
                this.tabs.delete(tag);

                let firstTab = this.tabs.keys().next().value;
                if (firstTab) {
                    this.showTab(firstTab);
                }
            }
        }

        /** Show a certain tab by its tag. */
        showTab(tag: string) {
            for (let [key, value] of this.tabs) {
                value.show(key == tag);
            }
        }

        /** Toggle the window from on or off position. */
        toggle() {
            this.rootElement.classList.toggle("hidden");
        }

        /**
         * Show or hide the window.
         * @param flag If the window is to be shown.
         */
        show(flag: boolean) {
            if (flag) {
                this.rootElement.classList.remove("hidden");
            } else {
                this.rootElement.classList.add("hidden");
            }
        }
    }
}

export default Drawer;