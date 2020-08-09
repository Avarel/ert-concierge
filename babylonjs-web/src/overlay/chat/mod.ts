import ChatComponent, { EntryProps, StatusProps, MessageProps } from "./components";
import React from "react";
import ReactDOM from "react-dom";

/** Basic chat UI. */
export module Chat {
    interface Entry {
        /** Turn the entry into props for rendering. */
        toObject(): EntryProps
    }

    /** Status entry for the chat instance. */
    export class Status implements Entry {
        /**
         * Construct a status entry.
         * @param text Text of the status.
         */
        constructor(public text: string) { }

        toObject(): StatusProps {
            return {
                type: "STATUS",
                text: this.text
            }
        }
    }

    /** Message entry for the chat instance. */
    export class Message implements Entry {
        /**
         * Construct a message entry.
         * @param name Name of the message's author.
         * @param text Text of the message.
         * @param you Whether that message was sent by "you".
         */
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

    /**
     * Convenient implementation for programmatically interacting
     * with the chat element and rendering it to the DOM or other React elements.
     */
    export class Instance {
        private readonly element?: HTMLElement;
        private readonly entries: Entry[] = [];
        private component?: ChatComponent;

        /**
         * Construct a chat instance.
         * @param selectorOrElement If a string (selector) is provided, it the 
         *          instance will bind to the first element that is 
         *          a descendant of node that matches selectors. Otherwise, it will
         *          assume that either `undefined` or an HTMLElement was passed in
         *          and bind to it instead.
         * @param onSubmit Callback for when the input of the chat component is submitted.
         */
        constructor(
            selectorOrElement?: string | HTMLElement,
            public onSubmit?: ((text: string) => void)
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

        /**
         * Add an entry.
         * @param entry An object implementing the entry interface.
         */
        addEntry(entry: Entry) {
            this.entries.push(entry);
            this.renderToDOM();
        }

        /**
         * Add a status entry.
         * @param text Text of the status.
         */
        addStatus(text: string) {
            this.addEntry(new Status(text));
        }

        /**
         * Add a message entry.
         * @param name Name of the message's author.
         * @param text Text of the message.
         * @param you Whether that message was sent by "you".
         */
        addMessage(name: string, text: string, you: boolean = false) {
            this.addEntry(new Message(name, text, you));
        }

        /** Return JSX element of this instance. */
        render() {
            return React.createElement(ChatComponent, {
                items: Array.from(this.entries, entry => entry.toObject()),
                onSubmit: this.onSubmit
            });
        }

        /** Render to the DOM if an element/selector is provided. */
        renderToDOM() {
            if (this.element) {
                this.component = ReactDOM.render(this.render(), this.element);
            }
        }
    }
}

export default Chat;