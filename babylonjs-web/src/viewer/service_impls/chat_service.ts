import { ServiceEventHandler } from "../../concierge_api/handlers";
import { Client } from '../../concierge_api/mod';
import { Payload } from '../../concierge_api/payloads';
import React from 'react';
import { Chat } from "../../overlay/mod";
import Tabbed from "../../overlay/tabbed/mod";

export class ChatService extends ServiceEventHandler {
    private static readonly CHAT_GROUP = "chat";
    private tab?: Tabbed.Tab;
    private items: (Chat.Message | Chat.Status)[] = [];

    constructor(client: Client, private readonly tabComponent: Tabbed.Instance) {
        super(client, ChatService.CHAT_GROUP);
        this.onEnter = this.onEnter.bind(this);
        this.renderTab();
    }

    onSubscribe() {
        this.tab = this.tabComponent.addTab(ChatService.CHAT_GROUP, "Chat");
        this.renderTab();
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
                group: ChatService.CHAT_GROUP,
            },
            data: text
        });
    }

    renderTab() {
        if (this.tab) {
            this.tab.reactContent = React.createElement(Chat.Component, {
                items: this.items,
                onSubmit: this.onEnter
            });
        }
    }

    addStatus(text: string) {
        this.items.push({
            type: "STATUS",
            text,
        });
        this.renderTab();
    }

    addMessage(name: string, text: string, you: boolean = false) {
        this.items.push({
            type: "MESSAGE",
            name,
            text,
            you
        });
        this.renderTab();
    }


    onMessage(message: Payload.Message<any>) {
        if (!message.origin || message.origin.group?.name != ChatService.CHAT_GROUP) {
            return;
        }

        if (typeof message.data != "string") {
            return;
        }

        this.addMessage(message.origin.name, message.data, message.origin.name == this.client.name);
    }

    onUnsubscribe() {
        this.tabComponent.removeTab("chat");
        this.tab = undefined;
    }
}