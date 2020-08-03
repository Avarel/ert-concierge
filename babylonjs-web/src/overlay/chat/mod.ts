import "./style.scss";

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}

export module Chat {
    export interface Message {
        name: string,
        text: string,
        element: HTMLDivElement,
    }

    export class UI {
        messagesElement!: HTMLDivElement;
        messages: Message[] = [];
        onEnter?: (text: string) => void;

        constructor(public rootElement: HTMLElement) {
            this.setup();
        }

        /**
         * Setup the chat elements.
         */
        private setup() {
            let messagesDiv = this.rootElement.querySelector<HTMLDivElement>("div.messages")
                || createElement("div", ["messages"]);
            let inputDiv = this.rootElement.querySelector<HTMLDivElement>("div.input")
                || createElement("div", ["input"]);
            let inputField = inputDiv.querySelector<HTMLInputElement>("input")
                || createElement("input");
            inputDiv.appendChild(inputField);
            let buttonDiv = inputDiv.querySelector<HTMLInputElement>("div.button")
                || createElement("div", ["button"]);
            inputDiv.appendChild(buttonDiv);
            inputField.addEventListener("keydown", (event) => {
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
            let entryDiv = you
                ? createElement("div", ["entry", "you"])
                : createElement("div", ["entry"]);
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

        /**
         * Add a status message.
         * @param text Status text.
         */
        addStatus(text: string) {
            let element = this.createStatusElement(text);
            this.messagesElement.appendChild(element);
            this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
        }

        /**
         * Add a user message.
         * @param name Name of the sender.
         * @param text Text of the message.
         * @param you If the client is the sender/"you".
         */
        addMessage(name: string, text: string, you: boolean = false) {
            let element = this.createMessageElement(name, text, you);
            this.messagesElement.appendChild(element);
            this.messages.push({ name, text, element });
            this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
        }
    }
}

export default Chat;