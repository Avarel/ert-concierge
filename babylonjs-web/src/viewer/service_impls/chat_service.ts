import Client, { Payload, ServiceEventHandler } from '../../concierge_api/mod';
import { Chat } from "../../overlay/mod";
import Tabbed from "../../overlay/tabbed/mod";

interface StatusPayload {
    type: "STATUS",
    text: string
}

interface TextPayload {
    type: "TEXT",
    author: string,
    author_uuid: string,
    text: string,
}

interface InputPayload {
    type: "INPUT",
    text: string
}

type ChatPayload = StatusPayload | TextPayload | InputPayload;

export class ChatService extends ServiceEventHandler<ChatPayload> {
    private tab?: Tabbed.Tab;
    private chatInstance?: Chat.Instance;

    constructor(
        client: Client,
        private readonly tabComponent: Tabbed.Instance
    ) {
        super(client, "chat_service");
    }

    private chatInstanceUpdateReact() {
        if (this.tab && this.chatInstance) {
            this.tab.reactContent = this.chatInstance.render();
        }
    }

    /**
     * Fired on the input being entered.
     * @param text The text in the UI.
     */
    private onEnter(text: string) {
        this.sendToService({ type: "INPUT", text });
    }

    protected onServiceMessage(payload: ChatPayload) {
        if (payload.type == "STATUS") {
            this.chatInstance?.addStatus(payload.text);
        } else if (payload.type == "TEXT") {
            this.chatInstance?.addMessage(payload.author, payload.text, payload.author_uuid == this.client.uuid);
        }
        this.chatInstanceUpdateReact();
    }


    protected onSubscribe() {
        this.tab = this.tabComponent.addTab(this.serviceName, "Chat");
        this.chatInstance = new Chat.Instance(undefined, text => this.onEnter(text));
        this.chatInstanceUpdateReact();
    }

    protected onUnsubscribe() {
        this.tabComponent.removeTab(this.serviceName);
        this.tab = undefined;
        this.chatInstance = undefined;
    }
}