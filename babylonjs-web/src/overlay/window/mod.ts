import "./index.scss";

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

export namespace Window {
    export class Tab {
        tag: string;
        headerElement: HTMLElement;
        bodyElement: HTMLElement;

        constructor(tag: string, headerElement: HTMLElement, bodyElement: HTMLElement) {
            this.tag = tag;
            this.headerElement = headerElement;
            this.bodyElement = bodyElement;
        }

        show(flag: boolean = true) {
            if (flag) {
                this.bodyElement.classList.remove("hidden");
            } else {
                this.bodyElement.classList.add("hidden");
            }
        }
    }

    export class UI {
        rootElement: HTMLElement;
        headerElement: HTMLElement;
        toggleElement: HTMLElement;
        bodyElement: HTMLElement;
        tabs: Map<string, Tab> = new Map();

        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
            this.headerElement = rootElement.querySelector<HTMLElement>(".header") || createElement("div", ["header"]);
            this.rootElement.prepend(this.headerElement);
            this.toggleElement = this.headerElement.querySelector(".window-drawer") || createElement("div", ["window-drawer"]);
            this.headerElement.prepend(this.toggleElement);

            this.toggleElement.addEventListener("click", () => {
                this.toggle();
            });

            this.bodyElement = rootElement.querySelector<HTMLElement>(".body") || createElement("div", ["body"]);
            this.rootElement.append(this.bodyElement);

            // this.bodyElement.querySelectorAll<HTMLElement>(".tab").forEach((element, key) => {
            //     if (key === 0) {
            //         element.classList.remove("hidden");
            //     } else {
            //         element.classList.add("hidden");
            //     }
            // });

            this.headerElement.querySelectorAll<HTMLElement>(".tab").forEach((headerElement, i) => {
                let tag = headerElement.getAttribute("tag");
                if (tag) {
                    for (let bodyElement of this.bodyElement.querySelectorAll<HTMLElement>(".tab")) {
                        let bodyTag = bodyElement.getAttribute("tag");
                        if (bodyTag == tag) {
                            let tab = new Tab(tag, headerElement, bodyElement);
                            this.tabs.set(tag, tab);
                            tab.show(i == 0);
                        }
                    }
                    headerElement.addEventListener("click", () => {
                        this.show(true);
                        this.showTab(tag!);
                    });
                }
            });
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