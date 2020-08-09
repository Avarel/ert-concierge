import Client, { Payload, ServiceEventHandler } from '../../concierge_api/mod';
import { Chat } from "../../overlay/mod";
import Tabbed from "../../overlay/tabbed/mod";

export class ChatService extends ServiceEventHandler<{ text: string }> {
    private tab?: Tabbed.Tab;
    private chatInstance?: Chat.Instance;

    constructor(
        client: Client,
        private readonly tabComponent: Tabbed.Instance
    ) {
        super(client, "chat");
    }

    onSubscribe() {
        this.tab = this.tabComponent.addTab(this.serviceName, "Chat");
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
    private onEnter(text: string) {
        this.sendToService({ text });
    }

    protected onServiceMessage(payload: { text: string }) {
        // if (payload.type == "MESSAGE") {
        //     if (!payload.origin || payload.origin.service?.name != ChatService.CHAT_GROUP) {
        //         return;
        //     }
    
        //     if (typeof payload.data != "string") {
        //         return;
        //     }
    
        //     this.chatInstance?.addMessage(
        //         payload.origin.name,
        //         payload.data,
        //         payload.origin.uuid == this.client.uuid
        //     );
        //     this.chatInstanceUpdateReact();
        // } else {
        //     super.onReceive(payload);
        // }
    }

    protected onUnsubscribe() {
        this.tabComponent.removeTab("chat");
        this.tab = undefined;
        this.chatInstance = undefined;
    }
}