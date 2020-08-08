import { Uuid, Payload } from "./payloads";
import { RawHandler, ServiceEventHandler } from "./handlers";

interface EventAwaitPoint {
    readonly seq: number,
    readonly timeoutHandle: number,
    readonly callback: (payload: Readonly<Payload.Any<any>>) => void
}

/**
 * Central connector to the concierge.
 */
export default class Client {
    private socket?: WebSocket;
    private version?: string;
    private secret?: string;
    private seq: number = -1;

    private readonly handlers: RawHandler[] = [];
    private readonly waiters: Map<number, EventAwaitPoint> = new Map();

    reconnectInterval: number = 10000;
    uuid!: Uuid;

    constructor(
        readonly name: string,
        readonly url: string,
        public reconnect: boolean = false
    ) { }

    connect(version: string, secret?: string) {
        console.info("Trying to connect to ", this.url);
        this.version = version;
        this.secret = secret;
        this.socket = new WebSocket(this.url, "ert-concierge");
        this.socket.onopen = event => this.onOpen(event);
        this.socket.onmessage = event => this.onReceive(event);
        this.socket.onerror = event => this.onError(event);
        this.socket.onclose = event => this.onClose(event);
    }

    sendPayload(
        payload: Readonly<Payload.Any<any>>,
        callback?: (payload: Readonly<Payload.Any<any>>) => void
    ): number {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected")
        }
        this.socket.send(JSON.stringify(payload));
        const seq = this.seq;
        this.seq += 1;

        if (callback) {
            const timeoutHandle = window.setTimeout(() => {
                this.waiters.delete(seq);
            }, 5000);
            this.waiters.set(seq, { seq, timeoutHandle, callback });
        }

        return seq;
    }

    close(code?: number, reason?: string, reconnect: boolean = true) {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected")
        }
        this.socket.close(code, reason);
        if (reconnect) {
            this.tryReconnect();
        } else {
            this.socket = undefined;
            this.version = undefined;
            this.secret = undefined;
        }
    }

    addHandler(handler: RawHandler) {
        this.handlers.push(handler);
    }

    removeHandler(handler: RawHandler) {
        for (let i = 0; i < this.handlers.length; i++) {
            if (this.handlers[i] === handler) {
                this.handlers.splice(i, 1);
                i -= 1;
            }
        }
    }

    private tryReconnect() {
        if (this.reconnect) {
            console.warn("Connection closed, reconnecting in", this.reconnectInterval, "ms")
            setTimeout(() => {
                this.connect(this.version!, this.secret);
            }, this.reconnectInterval);
        }
    }

    private onOpen(event: Event) {
        for (const handler of this.handlers) {
            handler.onOpen?.(event);
        }
        if (this.version == undefined) {
            throw new Error("Version is undefined")
        }
        console.log("Identifying with version", this.version);
        this.sendPayload({
            type: "IDENTIFY",
            name: this.name,
            version: this.version,
            secret: this.secret,
            tags: ["babylon"]
        });
    }

    private onClose(event: CloseEvent) {
        for (const handler of this.handlers) {
            handler.onClose?.(event);
        }
        console.warn(event.code, event.reason);
        this.tryReconnect();
    }

    private onReceive(event: MessageEvent) {
        const data = JSON.parse(event.data);
        // Hopeful check that it has a type field.
        if (typeof data == "object" && data.hasOwnProperty("type")) {
            const payload = data as Payload.Any<any>;

            // Special case hello.
            if (payload.type == "HELLO") {
                console.log("Assigned uuid", payload.uuid);
                this.uuid = payload.uuid;
                this.seq = 0;
            }

            // Listen for any await points.
            const seq = payload.seq;
            if (seq != undefined) {
                const awaitPoint = this.waiters.get(seq);
                if (awaitPoint) {
                    this.waiters.delete(seq);
                    window.clearTimeout(awaitPoint.timeoutHandle);
                    awaitPoint.callback(payload);
                }
            }

            // Pass to all handlers.
            for (const handler of this.handlers) {
                handler.onReceive?.(payload);
            }
        }
    }

    private onError(event: Event) {
        for (const handler of this.handlers) {
            handler.onError?.(event);
        }
        console.log(event);
    }
}

export { Uuid, Payload, RawHandler, ServiceEventHandler };