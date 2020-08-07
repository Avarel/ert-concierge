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

    /** 
     * Keeps track of the sequence number of a group fetch [all] request.
     * The service handler should only respond to a fetch result
     * if the returned sequence number matches.
     */
    private fetchSeq?: number;
    
    /** 
     * The service handler should only respond to a subscription result
     * if the returned sequence number matches.
     */
    private subSeq?: number;

    constructor(
        protected readonly client: Client, 
        readonly group: string,
        public autoSubscribe: boolean = true,
    ) {
        super();
    }

    onClose(_event: CloseEvent) {
        this.onUnsubscribe();
    }

    onHello(_event: Payload.Hello) {
        if (this.autoSubscribe) {
            this.fetchSeq = this.client.sendJSON({
                type: "GROUP_FETCH",
                name: this.group
            });
        }
    }

    onGroupFetchResult(event: Payload.GroupFetchResult) {
        if (event.seq == this.fetchSeq && event.name == this.group) {
            this.fetchSeq = undefined;
            this.subscribe();
        }
    }

    subscribe() {
        this.subSeq = this.client.sendJSON({
            type: "SELF_SUBSCRIBE",
            name: this.group
        });
    }

    unsubscribe() {
        this.client.sendJSON({
            type: "SELF_UNSUBSCRIBE",
            name: this.group
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
        switch (status.code) {
            case "NO_SUCH_GROUP":
                if (status.name == this.group && status.seq == (this.subSeq || this.fetchSeq)) {
                    console.warn("Group `", this.group, "` does not exist on concierge.");
                }
                break;
            case "GROUP_DELETED":
                if (status.name == this.group) {
                    console.warn("Group `", this.group, "` has been deleted on the concierge.");
                }
                break;
            case "GROUP_CREATED":
                if (status.name == this.group && this.autoSubscribe) {
                    this.subscribe();
                }
                break;
            case "SELF_SUBSCRIBED":
                if (status.name == this.group && this.subSeq == status.seq) {
                    console.info("Subscribed to `", this.group, "`.");
                    this.subscribed = true;
                    this.subSeq = undefined;
                    this.onSubscribe();
                }
                break;
            case "SELF_UNSUBSCRIBED":
                if (status.name == this.group) {
                    console.info("Unsubscribed from `", this.group, "`.");
                    this.subscribed = false;
                    this.onUnsubscribe();
                }
                break;
        }
    }
}