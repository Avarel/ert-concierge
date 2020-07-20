import "./index.scss";

export namespace Window {
    export class UI {
        rootElement: HTMLElement;
        toggleElement: HTMLElement | null;

        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
            this.toggleElement = rootElement.querySelector<HTMLElement>(".window-drawer");

            this.toggleElement?.addEventListener("click", () => {
                this.rootElement.classList.toggle("hidden");
            });
        }

        toggle() {
            this.rootElement.classList.toggle("hidden");
        }
    }
}

export default Window;