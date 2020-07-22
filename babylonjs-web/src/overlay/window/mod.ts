import "./style.scss";

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

export module Window {
    export class Tab {
        tag: string;
        header: HTMLElement;
        body: HTMLElement;

        constructor(tag: string, headerElement: HTMLElement, bodyElement: HTMLElement) {
            this.tag = tag;
            this.header = headerElement;
            this.body = bodyElement;
        }

        show(flag: boolean = true) {
            if (flag) {
                this.header.classList.add("active");
                this.body.classList.add("active");
            } else {
                this.header.classList.remove("active");
                this.body.classList.remove("active");
            }
        }
    }

    export class UI {
        rootElement: HTMLElement;
        headerElement: HTMLElement;
        drawerElement: HTMLElement;
        bodyElement: HTMLElement;
        tabs: Map<string, Tab> = new Map();

        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
            this.headerElement = rootElement.querySelector<HTMLElement>(".header") || createElement("div", ["header"]);
            this.rootElement.prepend(this.headerElement);
            this.drawerElement = this.headerElement.querySelector(".window-drawer") || createElement("div", ["window-drawer"]);
            this.headerElement.prepend(this.drawerElement);

            this.drawerElement.addEventListener("click", () => {
                this.toggle();
            });

            this.bodyElement = rootElement.querySelector<HTMLElement>(".body") || createElement("div", ["body"]);
            this.rootElement.append(this.bodyElement);

            this.bodyElement.querySelectorAll<HTMLElement>(".tab").forEach((tabBody, i) => {
                let bodyTag = tabBody.getAttribute("tag");
                if (bodyTag) {
                    let label = tabBody.getAttribute("label") || bodyTag;
                    let tab = this.addTab(bodyTag, label, tabBody);
                    tab.show(i == 0);
                }
            });
        }

        addTab(tag: string, label: string, tabBody: HTMLElement): Tab {
            let tabHeader = createElement("div", ["tab"]);
            tabHeader.innerText = label;
            this.headerElement.appendChild(tabHeader);
            this.bodyElement.appendChild(tabBody);

            let tab = new Tab(tag, tabHeader, tabBody);
            this.tabs.set(tag, tab);

            tabHeader.addEventListener("click", () => {
                this.show(true);
                this.showTab(tag!);
            });

            return tab;
        }

        removeTab(tag: string) {
            let tab = this.tabs.get(tag);
            if (tab) {
                tab.body.remove();
                tab.header.remove();
                this.tabs.delete(tag);
            }
        }

        showTab(tag: string) {
            for (let [key, value] of this.tabs) {
                value.show(key == tag);
            }
        }

        /**
         * Toggle the window from on or off position.
         */
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

export default Window;