import * as ConciergeAPI from "./concierge_api";
import { Chat } from '../overlay/overlay';

const CHAT_GROUP = "chat";

export class ChatHandler extends ConciergeAPI.ServiceEventHandler {
    readonly client: ConciergeAPI.Client;
    readonly ui: Chat.UI;

    constructor(client: ConciergeAPI.Client, ui: Chat.UI) {
        super(client, CHAT_GROUP);
        this.client = client;
        this.ui = ui;
        ui.onEnter = (text) => {
            this.onEnter(text);
        };
    }

    onSubscribe() {
        this.ui.addStatus("Connected to the chat system.")
    }

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

    onRecvMessage(message: ConciergeAPI.Payloads.Message<any>) {
        if (!message.origin || message.origin.group != CHAT_GROUP) {
            return;
        }

        if (typeof message.data != "string") {
            return;
        }
        
        this.ui.addMessage(message.origin.name, message.data, message.origin.name == this.client.name);
    }

    onUnsubscribe() {
        this.ui.addStatus("Disconnected from the chat system.")
    }
}