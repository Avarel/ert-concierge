import { ServiceEventHandler } from "../concierge_api/handlers";
import { Client } from '../concierge_api/mod';
import { Payload } from '../concierge_api/payloads';
import React from 'react';
import { Chat } from "../overlay/mod";
import Tabbed from "../overlay/tabbed/mod";

const CHAT_GROUP = "chat";

export class ChatHandler extends ServiceEventHandler {
    private readonly tab: Tabbed.Tab;
    private items: (Chat.Message | Chat.Status)[] = [];

    constructor(client: Client, private readonly tabComponent: Tabbed.Instance) {
        super(client, CHAT_GROUP);
        this.tab = this.tabComponent.addTab("chat", "Chat");
        this.onEnter = this.onEnter.bind(this);
        this.render();
    }

    onSubscribe() {
        this.addStatus("Connected to the chat system.");
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

    render() {
        this.tab.reactContent = React.createElement(Chat.Component, {
            items: this.items,
            onSubmit: this.onEnter
        });
    }

    addStatus(text: string) {
        this.items.push({
            type: "STATUS",
            text,
        });
        this.render();
    }

    addMessage(name: string, text: string, you: boolean = false) {
        this.items.push({
            type: "MESSAGE",
            name,
            text,
            you
        });
        this.render();
    }


    onMessage(message: Payload.Message<any>) {
        if (!message.origin || message.origin.group?.name != CHAT_GROUP) {
            return;
        }

        if (typeof message.data != "string") {
            return;
        }

        this.addMessage(message.origin.name, message.data, message.origin.name == this.client.name);
    }

    onUnsubscribe() {
        this.addStatus("Disconnected from the chat system.");
    }
}