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
    onReceive(payload: Readonly<Payload.Out>): void;
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
    private __subscribed: boolean = false;
    /** Is this handler subscribed to its service group. */
    get subscribed(): boolean {
        return this.__subscribed;
    }

    /**
     * Construct a service event handler.
     * 
     * @param client The central server client.
     * @param serviceName The name of the service.
     * @param autoSubscribe Should the service event handler subscribe 
     *          as eagerly as possible? This means that it will try to 
     *          subscribe immediately when the client first logs on and 
     *          when the group is created.
     */
    constructor(
        readonly client: Client,
        readonly serviceName: string,
        public autoSubscribe: boolean = true,
    ) { }

    onClose(_: CloseEvent) {
        if (this.__subscribed) {
            this.onUnsubscribe();
        }
    }

    /**
     * Send a message to the service's owner.
     * 
     * @param data The data as a valid JSON object.
     */
    sendToService(data: Readonly<T>) {
        this.client.sendPayload({
            type: "MESSAGE",
            target: {
                type: "SERVICE",
                service: this.serviceName
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
    onReceive(payload: Readonly<Payload.Out>): void {
        switch (payload.type) {
            case "MESSAGE":
                if (payload.type == "MESSAGE" && payload.origin!.service?.name == this.serviceName) {
                    this.onServiceMessage(payload.data);
                }
                break;
            case "HELLO":
                if (this.autoSubscribe) {
                    this.client.sendPayload({
                        type: "SERVICE_FETCH",
                        service: this.serviceName
                    }, payload => {
                        if (payload.type == "SERVICE_FETCH_RESULT") {
                            this.subscribe();
                        }
                    });
                }
                break;
            case "SERVICE_DELETE_RESULT":
                if (payload.service.name == this.serviceName) {
                    console.info(`Service: "${this.serviceName}" deleted on the server.`);
                    if (this.__subscribed) {
                        this.__subscribed = false;
                        this.onUnsubscribe();
                    }
                }
                break;
            case "SERVICE_CREATE_RESULT":
                if (payload.service.name == this.serviceName && this.autoSubscribe) {
                    this.subscribe();
                }
                break;
            case "SELF_UNSUBSCRIBE_RESULT":
                if (payload.service.name == this.serviceName && this.__subscribed && payload.successful) {
                    console.info(`Service: Unsubscribed to "${this.serviceName}".`);
                    this.__subscribed = false;
                    this.onUnsubscribe();
                }
                break;
        }
    }


    /** Try to subscribe to the service. */
    subscribe() {
        this.client.sendPayload({
            type: "SELF_SUBSCRIBE",
            service: this.serviceName
        }, payload => {
            if (payload.type == "SELF_SUBSCRIBE_RESULT" && payload.successful) {
                console.info(`Service: Subscribed to "${this.serviceName}".`);
                this.__subscribed = true;
                this.onSubscribe();
            }
        });
    }

    /** Try to unsubscribe from the service. */
    unsubscribe() {
        this.client.sendPayload({
            type: "SELF_UNSUBSCRIBE",
            service: this.serviceName
        });
    }

    /** Called when receiving a payload from the service. */
    protected abstract onServiceMessage(payload: Readonly<T>): void;

    /** Called when the handler successfully subscribes to the group. */
    protected abstract onSubscribe(): void;

    /** Called when the handler is unsubscribed from the group. */
    protected abstract onUnsubscribe(): void;
}