import "../scss/overlay.scss";

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

export namespace Chat {
    export interface Message {
        name: string,
        text: string,
        element: HTMLDivElement,
    }

    export class UI {
        rootElement: HTMLElement;
        messagesElement!: HTMLDivElement;
        messages: Message[] = [];
        onEnter?: (text: string) => void;

        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
            this.setup();
        }

        private setup() {
            let messagesDiv = this.rootElement.querySelector<HTMLDivElement>("div.messages")
                || createElement("div", ["messages"]);
            let inputDiv = createElement("div", ["input"]);
            let inputField = createElement("input");
            inputDiv.appendChild(inputField);
            let buttonDiv = createElement("div", ["button"]);
            inputDiv.appendChild(buttonDiv);
            inputField.addEventListener("keyup", (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    buttonDiv.click();
                }
            });

            buttonDiv.addEventListener("click", (event) => {
                if (inputField.value.length > 0) {
                    this.onEnter?.(inputField.value);
                    inputField.value = "";
                }
            });

            this.messagesElement = messagesDiv;

            this.rootElement.appendChild(messagesDiv);
            this.rootElement.appendChild(inputDiv);
        }

        private createMessageElement(name: string, text: string, you: boolean = false): HTMLDivElement {
            let entryDiv = you ? createElement("div", ["entry", "you"]) : createElement("div", ["entry"]);
            let nameDiv = createElement("div", ["name"]);
            nameDiv.innerText = name;
            let textDiv = createElement("div", ["text"]);
            textDiv.innerText = text;
            entryDiv.appendChild(nameDiv);
            entryDiv.appendChild(textDiv);
            return entryDiv;
        }

        private createStatusElement(text: string): HTMLDivElement {
            let entryDiv = createElement("div", ["entry", "status"]);
            let textDiv = createElement("div", ["text"]);
            textDiv.innerText = text;
            entryDiv.appendChild(textDiv);
            return entryDiv;
        }

        addStatus(text: string) {
            let element = this.createStatusElement(text);
            this.messagesElement.appendChild(element);
        }

        addMessage(name: string, text: string, you: boolean = false) {
            let element = this.createMessageElement(name, text, you);
            this.messagesElement.appendChild(element);
            this.messages.push({ name, text, element })
        }
    }
}

export namespace Sidebar {
    export interface Icon {
        name: string,
        element: HTMLElement
    }

    export class UI {
        rootElement: HTMLElement;
        icons: Icon[] = [];

        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
        }

        private baseIcon(): HTMLDivElement {
            return createElement("div", ["icon"]);
        }

        clear() {
            for (let icon of this.icons) {
                icon.element.remove();
            }
            this.icons.length = 0;
        }

        addImageIcon(name: string, link: string) {
            let iconDiv = this.baseIcon();

            let imgElement = createElement("img");
            imgElement.setAttribute("src", link);
            iconDiv.appendChild(imgElement);

            let tooltipElement = createElement("div", ["tooltip"]);
            tooltipElement.innerText = name;
            iconDiv.append(tooltipElement);

            this.rootElement.appendChild(iconDiv);
            this.icons.push({ name, element: iconDiv });
        }

        addInitialIcon(name: string, text: string) {
            let iconDiv = this.baseIcon();

            let pElement = createElement("p");
            pElement.innerText = text.toUpperCase();
            iconDiv.appendChild(pElement);

            let tooltipElement = createElement("div", ["tooltip"]);
            tooltipElement.innerText = name;
            iconDiv.append(tooltipElement);

            this.rootElement.appendChild(iconDiv);
            this.icons.push({ name, element: iconDiv });
        }

        removeIcon(name: string) {
            for (let i = 0; i < this.icons.length; i++) {
                let icon = this.icons[i];
                if (icon.name == name) {
                    icon.element.remove();
                    this.icons.splice(i, 1);
                }
            }
        }
    }
}

document.querySelector(".window-drawer")!.addEventListener('click', () => {
    document.querySelector(".window")!.classList.toggle("hidden");
});