import ChatComponent, { EntryProps, StatusProps, MessageProps } from "./components";
import React from "react";
import ReactDOM from "react-dom";

export module Chat {
    interface Entry {
        toObject(): EntryProps
    }

    export class Status implements Entry {
        constructor(public text: string) { }

        toObject(): StatusProps {
            return {
                type: "STATUS",
                text: this.text
            }
        }
    }

    export class Message implements Entry {
        constructor(
            public name: string,
            public text: string,
            public you: boolean
        ) { }

        toObject(): MessageProps {
            return {
                type: "MESSAGE",
                name: this.name,
                text: this.text,
                you: this.you
            }
        }
    }

    export class Instance {
        private readonly element?: HTMLElement;
        private readonly entries: Entry[] = [];
        private component?: ChatComponent;

        constructor(
            selectorOrElement?: string | HTMLElement,
            public onEnter?: ((text: string) => void)
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

        addEntry(entry: Entry) {
            this.entries.push(entry);
        }

        addStatus(text: string) {
            this.addEntry(new Status(text));
            this.renderToDOM();
        }

        addMessage(name: string, text: string, you: boolean = false) {
            this.addEntry(new Message(name, text, you));
            this.renderToDOM();
        }

        render() {
            return React.createElement(ChatComponent, {
                items: Array.from(this.entries, entry => entry.toObject()),
                onSubmit: this.onEnter
            });
        }

        renderToDOM() {
            if (this.element) {
                this.component = ReactDOM.render(this.render(), this.element);
            }
        }
    }
}

export default Chat;