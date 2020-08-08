import Client, { Payload } from "./mod";

/**
 * Low level handler for the concierge client. Events from JS sockets are passed
 * directly to this handler.
 */
export interface RawHandler {
    onOpen?(event: Event): void;
    onClose?(event: CloseEvent): void;
    onReceive(payload: Readonly<Payload.Any<any>>): void;
    onError?(event: Event): void;
}

/**
 * Utility class that automatically handles subscription to a specific group.
 */
export abstract class ServiceEventHandler implements RawHandler {
    private _subscribed: boolean = false;

    constructor(
        protected readonly client: Client, 
        readonly group: string,
        public autoSubscribe: boolean = true,
    ) { }

    onClose(_: CloseEvent) {
        if (this._subscribed) {
            this.onUnsubscribe();
        }
    }

    onReceive(payload: Readonly<Payload.Any<any>>) {
        switch (payload.type) {
            case "HELLO":
                if (this.autoSubscribe) {
                    this.client.sendPayload({
                        type: "GROUP_FETCH",
                        name: this.group
                    }, _ => {
                        this.subscribe();
                    });
                }
                break;
            case "STATUS":
                switch (payload.code) {
                    case "GROUP_DELETED":
                        if (payload.name == this.group) {
                            console.info(`Service: "${this.group}" deleted on the server.`);
                        }
                        break;
                    case "GROUP_CREATED":
                        if (payload.name == this.group && this.autoSubscribe) {
                            this.subscribe();
                        }
                        break;
                    case "SELF_UNSUBSCRIBED":
                        if (payload.name == this.group) {
                            console.info(`Service: Unsubscribed to "${this.group}".`);
                            this._subscribed = false;
                            this.onUnsubscribe();
                        }
                        break;
                }
                break;
        }
    }

    subscribe() {
        this.client.sendPayload({
            type: "SELF_SUBSCRIBE",
            name: this.group
        }, payload => {
            if (payload.type == "STATUS" && payload.code == "SELF_SUBSCRIBED") {
                console.info(`Service: Subscribed to "${this.group}".`);
                this._subscribed = true;
                this.onSubscribe();
            }
        });
    }

    get subscribed(): boolean {
        return this._subscribed;
    }

    unsubscribe() {
        this.client.sendPayload({
            type: "SELF_UNSUBSCRIBE",
            name: this.group
        });
    }

    /** Called when the handler successfully subscribes to the group. */
    protected abstract onSubscribe(): void;

    /** Called when the handler is unsubscribed from the group. */
    protected abstract onUnsubscribe(): void;
}