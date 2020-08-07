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
                this.onMessage?.(payload);
                break;
            case "HELLO":
                this.onHello?.(payload);
                break;
            case "GROUP_FETCH_RESULT":
                this.onGroupFetchResult?.(payload);
                break;
            case "GROUP_FETCH_ALL_RESULT":
                this.onGroupFetchAllResult?.(payload);
                break;
            case "CLIENT_FETCH_ALL_RESULT":
                this.onClientFetchAllResult?.(payload);
                break;
            case "SELF_FETCH_RESULT":
                this.onSelfFetchResult?.(payload);
                break;
            case "STATUS":
                this.onStatus?.(payload);
                break;
        }
    }

    onMessage?(message: Payload.Message<any>): void;
    onHello?(hello: Payload.Hello): void;
    onGroupFetchResult?(groupSubs: Payload.GroupFetchResult): void;
    onGroupFetchAllResult?(groupList: Payload.GroupFetchAllResult): void;
    onClientFetchAllResult?(clientList: Payload.ClientFetchAllResult): void;
    onSelfFetchResult?(subs: Payload.SelfFetchResult): void;
    onStatus?(status: Payload.Status): void;
}

/**
 * Utility class that automatically handles subscription to a specific group.
 */
export abstract class ServiceEventHandler extends EventHandler {
    protected subscribed: boolean = false;

    constructor(
        readonly client: Client, 
        protected group: string,
        public autoSubscribe: boolean = true,
    ) {
        super();
    }

    onClose(_event: CloseEvent) {
        this.onUnsubscribe();
    }

    onHello(_event: Payload.Hello) {
        this.client.sendJSON({
            type: "GROUP_FETCH",
            name: this.group
        })
    }

    onGroupFetchResult(event: Payload.GroupFetchResult) {
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

    onStatus(status: Payload.Status): void {
        // console.log("RECV", JSON.stringify(status));
        switch (status.code) {
            case "NO_SUCH_GROUP":
                if (status.name == this.group) {
                    console.warn("Group `", this.group, "` does not exist on concierge.");
                }
                break;
            case "GROUP_DELETED":
                if (status.name == this.group) {
                    console.warn("Group `", this.group, "` has been deleted on the concierge.");
                }
                break;
            case "GROUP_CREATED":
                if (status.name == this.group) {
                    this.subscribe(this.group);
                }
                break;
            case "SELF_SUBSCRIBED":
                if (status.name == this.group) {
                    console.log("Subscribed to `", this.group, "`.");
                    this.subscribed = true;
                    this.onSubscribe();
                }
                break;
            case "SELF_UNSUBSCRIBED":
                if (status.name == this.group) {
                    console.log("Unsubscribed from `", this.group, "`.");
                    this.subscribed = false;
                    this.onUnsubscribe();
                }
                break;
        }
    }
}