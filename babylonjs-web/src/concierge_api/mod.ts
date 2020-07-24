import { Uuid, GenericPayload } from "./payloads";
import { RawHandler } from "./handlers";

/**
 * Central connector to the concierge.
 */
export class Client {
    readonly url: string;
    readonly name: string;

    private socket?: WebSocket;
    private version?: string;
    private secret?: string;
    private seq: number = 0;

    reconnect: boolean;
    reconnectInterval: number = 10000;
    uuid!: Uuid;
    handlers: RawHandler[] = [];

    constructor(name: string, url: string, reconnect: boolean = false) {
        this.url = url;
        this.name = name;
        this.reconnect = reconnect;
    }

    connect(version: string, secret?: string) {
        console.info("Trying to connect to ", this.url);
        this.version = version;
        this.secret = secret;
        this.socket = new WebSocket(this.url);
        this.socket.onopen = event => this.onOpen(event);
        this.socket.onmessage = event => this.onReceive(event);
        this.socket.onerror = event => this.onError(event);
        this.socket.onclose = event => this.onClose(event);
    }

    sendJSON(payload: GenericPayload<any>): number {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected")
        }
        // console.log("SEND", JSON.stringify(payload));
        this.socket.send(JSON.stringify(payload));
        let tmp = this.seq;
        this.seq += 1;
        return tmp;
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

    private tryReconnect() {
        if (this.reconnect) {
            console.warn("Connection closed, reconnecting in", this.reconnectInterval, "ms")
            setTimeout(() => {
                this.connect(this.version!, this.secret);
            }, this.reconnectInterval);
        }
    }

    private onOpen(event: Event) {
        for (let handler of this.handlers) {
            handler.onOpen?.(event);
        }
        if (this.version == undefined) {
            throw new Error("Version is undefined")
        }
        console.log("Identifying with version", this.version);
        this.sendJSON({
            type: "IDENTIFY",
            name: this.name,
            version: this.version,
            secret: this.secret,
            tags: ["babylon"]
        });
    }

    private onClose(event: CloseEvent) {
        for (let handler of this.handlers) {
            handler.onClose?.(event);
        }
        console.warn(event.code, event.reason);
        this.tryReconnect();
    }

    private onReceive(event: MessageEvent) {
        let data = JSON.parse(event.data) as object;
        if (data.hasOwnProperty("type")) {
            let payload = data as GenericPayload<any>;

            if (payload.type == "HELLO") {
                console.log("Assigned uuid", payload.uuid);
                this.uuid = payload.uuid;
                this.seq = 0;
            }

            for (let handler of this.handlers) {
                handler.onReceive?.(payload);
            }
        }
    }

    private onError(event: Event) {
        for (let handler of this.handlers) {
            handler.onError?.(event);
        }
        console.log(event);
    }
}

export default Client;