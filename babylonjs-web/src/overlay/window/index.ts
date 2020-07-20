import "./index.scss";

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

export namespace Window {
    export class UI {
        rootElement: HTMLElement;
        headerElement: HTMLElement;
        toggleElement: HTMLElement;

        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
            this.headerElement = rootElement.querySelector<HTMLElement>(".header") || createElement("div", ["header"]);
            this.rootElement.prepend(this.headerElement);
            this.toggleElement = this.headerElement.querySelector(".window-drawer") || createElement("div", [".window-drawer"]);
            this.headerElement.prepend(this.toggleElement);

            this.toggleElement.addEventListener("click", () => {
                this.rootElement.classList.toggle("hidden");
            });
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
                this.rootElement.classList.add("hidden");
            } else {
                this.rootElement.classList.remove("hidden");
            }
        }
    }
}

export default Window;