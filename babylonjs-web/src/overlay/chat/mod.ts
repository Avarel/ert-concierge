import "./style.scss";
import React from "react";
import ReactDOM from "react-dom";
import { ChatComponent } from "./react";

export module Chat {
    interface Status {
        type: "STATUS",
        text: string
    }
    interface Message {
        type: "MESSAGE",
        name: string,
        text: string,
        you: boolean
    }

    type ChatItem = Status | Message;

    export class UI {
        rootElement: HTMLElement;
        items: ChatItem[] = [];
        onEnter?: (text: string) => void;

        constructor(rootElement: HTMLElement | string) {
            if (rootElement == undefined) {
                throw new Error("Root element must not be null!");
            } else if (typeof rootElement == "string") {
                let element = document.querySelector<HTMLElement>(rootElement);
                if (!element) {
                    throw new Error("Query selector " + rootElement + " return null!");
                }
                this.rootElement = element;
            } else {
                this.rootElement = rootElement;
            }
            this.render();
        }

        render() {
            ReactDOM.render(
                React.createElement(ChatComponent, {
                    items: this.items,
                    onSubmit: string => this.onEnter?.(string)
                }),
                this.rootElement
            );
        }

        /**
         * Add a status message.
         * @param text Status text.
         */
        addStatus(text: string) {
            this.items.push({ type: "STATUS", text });
            this.render();
        }

        /**
         * Add a user message.
         * @param name Name of the sender.
         * @param text Text of the message.
         * @param you If the client is the sender/"you".
         */
        addMessage(name: string, text: string, you: boolean = false) {
            this.items.push({ type: "MESSAGE", name, text, you });
            this.render();
        }
    }
}

export default Chat;