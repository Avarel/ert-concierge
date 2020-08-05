import { ServiceEventHandler } from "../concierge_api/handlers";
import { Client } from '../concierge_api/mod';
import { Payload } from '../concierge_api/payloads';
import React from 'react';
import { Chat } from "../overlay/mod";

const CHAT_GROUP = "chat";

export class ChatHandler extends ServiceEventHandler {
    constructor(client: Client, readonly ui: Chat.Component) {
        super(client, CHAT_GROUP);
        this.ui.onSubmit = this.onEnter.bind(this);
    }

    onSubscribe() {
        this.ui.addStatus("Connected to the chat system.");
    }

    /**
     * Fired on the input being entered.
     * @param text The text in the UI.
     */
    onEnter(text: string) {
        this.client.sendJSON({
            type: "MESSAGE",
            target: {
                type: "GROUP",
                group: CHAT_GROUP,
            },
            data: text
        });
    }

    onRecvMessage(message: Payload.Message<any>) {
        if (!message.origin || message.origin.group != CHAT_GROUP) {
            return;
        }

        if (typeof message.data != "string") {
            return;
        }
        
        this.ui.addMessage(message.origin.name, message.data, message.origin.name == this.client.name);
    }

    onUnsubscribe() {
        this.ui.addStatus("Disconnected from the chat system.");
    }
}