import { Client } from "./mod";
import { GenericPayload, Payload } from "./payloads";

/**
 * Low level handler for the concierge client. Events from JS sockets are passed
 * directly to this handler.
 */
export interface RawHandler {
    onOpen?(event: Event): void;
    onClose?(event: CloseEvent): void;
    onReceive?(payload: GenericPayload<any>): void;
    onError?(event: Event): void;
}

/**
 * Class that allows for high level interaction with incoming payloads.
 */
export abstract class EventHandler implements RawHandler {
    onReceive(payload: GenericPayload<any>): void {
        switch (payload.type) {
            case "MESSAGE":
                this.onRecvMessage?.(payload);
                break;
            case "HELLO":
                this.onRecvHello?.(payload);
                break;
            case "GROUP_FETCH_RESULT":
                this.onRecvGroupSubs?.(payload);
                break;
            case "GROUP_FETCH_ALL_RESULT":
                this.onRecvGroupList?.(payload);
                break;
            case "CLIENT_FETCH_ALL_RESULT":
                this.onRecvClientList?.(payload);
                break;
            case "SELF_FETCH_RESULT":
                this.onRecvSubscriptions?.(payload);
                break;
            case "STATUS":
                this.onRecvStatus?.(payload);
                break;
        }
    }

    onRecvMessage?(message: Payload.Message<any>): void;
    onRecvHello?(hello: Payload.Hello): void;
    onRecvGroupSubs?(groupSubs: Payload.GroupFetchResult): void;
    onRecvGroupList?(groupList: Payload.GroupFetchAllResult): void;
    onRecvClientList?(clientList: Payload.ClientFetchAllResult): void;
    onRecvSubscriptions?(subs: Payload.SelfFetchResult): void;
    onRecvStatus?(status: Payload.Status): void;
}

/**
 * Utility class that automatically handles subscription to a specific group.
 */
export abstract class ServiceEventHandler extends EventHandler {
    protected subscribed: boolean = false;

    constructor(readonly client: Client, protected group: string) {
        super();
    }

    onClose(_event: CloseEvent) {
        this.onUnsubscribe();
    }

    onRecvHello(_event: Payload.Hello) {
        this.client.sendJSON({
            type: "GROUP_FETCH",
            name: this.group
        })
    }

    onRecvGroupSubs(event: Payload.GroupFetchResult) {
        if (event.name == this.group) {
            this.subscribe(this.group);
        }
    }

    private subscribe(name: string) {
        this.client.sendJSON({
            type: "SELF_SUBSCRIBE",
            name
        });
    }

    /**
     * Called when the handler successfully subscribes to the group.
     */
    abstract onSubscribe(): void;

    /**
     * Called when the handler is unsubscribed from the group.
     */
    abstract onUnsubscribe(): void;

    onRecvStatus(status: Payload.Status): void {
        // console.log("RECV", JSON.stringify(status));
        switch (status.code) {
            case "NO_SUCH_GROUP":
                if (status.group == this.group) {
                    console.error("Group `", this.group, "` does not exist on concierge.");
                }
                break;
            case "GROUP_DELETED":
                if (status.group == this.group) {
                    console.warn("Group `", this.group, "` has been deleted on the concierge.");
                }
                break;
            case "GROUP_CREATED":
                if (status.group == this.group) {
                    this.subscribe(this.group);
                }
                break;
            case "SUBSCRIBED":
                if (status.group == this.group) {
                    console.log("Subscribed to `", this.group, "`.");
                    this.subscribed = true;
                    this.onSubscribe();
                }
                break;
            case "UNSUBSCRIBED":
                if (status.group == this.group) {
                    console.log("Unsubscribed from `", this.group, "`.");
                    this.subscribed = false;
                    this.onUnsubscribe();
                }
                break;
        }
    }
}