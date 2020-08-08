import Client, { Payload } from "./mod";

/**
 * Low level handler for the concierge client. Events from JS sockets are passed
 * directly to this handler.
 */
export interface RawHandler {
    /** Handles socket open events. */
    onOpen?(event: Event): void;
    /** Handles socket close events. */
    onClose?(event: CloseEvent): void;
    /**
     * Handles socket text events that are assumed to be valid
     * payloads.
     */
    onReceive(payload: Readonly<Payload.Any<any>>): void;
    /** Handle socket error events/ */
    onError?(event: Event): void;
}

/**
 * Utility class that correctly handles subscription and unsubscription from
 * a service group. This class is to be implemented by service handlers.
 * 
 * Multiple service event handlers of the same service is not supported
 * as of the moment, and will likely lead to unwanted behavior.
 */
export abstract class ServiceEventHandler<T> implements RawHandler {
    private _subscribed: boolean = false;
    /** Is this handler subscribed to its service group. */
    get subscribed(): boolean {
        return this._subscribed;
    }

    /**
     * Construct a service event handler.
     * 
     * @param client The central server client.
     * @param serviceName The name of the service.
     * @param autoSubscribe Should the service event handler subscribe 
     *                      as eagerly as possible? This means that it will
     *                      try to subscribe immediately when the client
     *                      first logs on and when the group is created.
     */
    constructor(
        protected readonly client: Client, 
        readonly serviceName: string,
        public autoSubscribe: boolean = true,
    ) { }

    onClose(_: CloseEvent) {
        if (this._subscribed) {
            this.onUnsubscribe();
        }
    }

    sendToService(data: Readonly<T>) {
        this.client.sendPayload({
            type: "MESSAGE",
            target: {
                type: "SERVICE",
                name: this.serviceName
            },
            data
        });
    }

    /**
     * This override automatically handles the subscription and unsubscription
     * process. It is a good idea to call `super.onReceive` for implementors
     * to benefit from this handler's behavior.
     * 
     * @param payload The payload.
     */
    onReceive(payload: Readonly<Payload.Any<T>>) {
        switch (payload.type) {
            case "HELLO":
                if (this.autoSubscribe) {
                    this.client.sendPayload({
                        type: "SERVICE_FETCH",
                        name: this.serviceName
                    }, _ => {
                        this.subscribe();
                    });
                }
                break;
            case "STATUS":
                switch (payload.code) {
                    case "SERVICE_DELETED":
                        if (payload.name == this.serviceName) {
                            console.info(`Service: "${this.serviceName}" deleted on the server.`);
                        }
                        break;
                    case "SERVICE_CREATED":
                        if (payload.name == this.serviceName && this.autoSubscribe) {
                            this.subscribe();
                        }
                        break;
                    case "SELF_UNSUBSCRIBED":
                        if (payload.name == this.serviceName && this._subscribed) {
                            console.info(`Service: Unsubscribed to "${this.serviceName}".`);
                            this._subscribed = false;
                            this.onUnsubscribe();
                        }
                        break;
                }
                break;
        }
    }

    /** Try to subscribe to the service. */
    subscribe() {
        this.client.sendPayload({
            type: "SELF_SUBSCRIBE",
            name: this.serviceName
        }, payload => {
            if (payload.type == "STATUS" && payload.code == "SELF_SUBSCRIBED") {
                console.info(`Service: Subscribed to "${this.serviceName}".`);
                this._subscribed = true;
                this.onSubscribe();
            }
        });
    }

    /** Try to unsubscribe from the service. */
    unsubscribe() {
        this.client.sendPayload({
            type: "SELF_UNSUBSCRIBE",
            name: this.serviceName
        });
    }

    /** Called when the handler successfully subscribes to the group. */
    protected abstract onSubscribe(): void;

    /** Called when the handler is unsubscribed from the group. */
    protected abstract onUnsubscribe(): void;
}