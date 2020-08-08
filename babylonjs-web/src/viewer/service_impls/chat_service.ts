import Client, { Payload, ServiceEventHandler } from '../../concierge_api/mod';
import { Chat } from "../../overlay/mod";
import Tabbed from "../../overlay/tabbed/mod";

export class ChatService extends ServiceEventHandler {
    private static readonly CHAT_GROUP = "chat";
    private tab?: Tabbed.Tab;
    private chatInstance?: Chat.Instance;

    constructor(
        client: Client,
        private readonly tabComponent: Tabbed.Instance
    ) {
        super(client, ChatService.CHAT_GROUP);
    }

    onSubscribe() {
        this.tab = this.tabComponent.addTab(ChatService.CHAT_GROUP, "Chat");
        this.chatInstance = new Chat.Instance(undefined, text => this.onEnter(text));
        this.chatInstanceUpdateReact();
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
    onEnter(text: string) {
        this.client.sendPayload({
            type: "MESSAGE",
            target: {
                type: "GROUP",
                group: ChatService.CHAT_GROUP,
            },
            data: text
        });
    }

    onReceive(payload: Payload.Any<any>) {
        if (payload.type == "MESSAGE") {
            if (!payload.origin || payload.origin.group?.name != ChatService.CHAT_GROUP) {
                return;
            }
    
            if (typeof payload.data != "string") {
                return;
            }
    
            this.chatInstance?.addMessage(
                payload.origin.name,
                payload.data,
                payload.origin.uuid == this.client.uuid
            );
            this.chatInstanceUpdateReact();
        } else {
            super.onReceive(payload);
        }
    }

    onUnsubscribe() {
        this.tabComponent.removeTab("chat");
        this.tab = undefined;
        this.chatInstance = undefined;
    }
}