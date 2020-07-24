import { Sidebar } from "../overlay/mod";
import { EventHandler } from "../concierge_api/handlers";
import Client from "../concierge_api/mod";
import Payload from "../concierge_api/payloads";

export class UsersHandler extends EventHandler {
    readonly ui: Sidebar.UI;
    readonly client: Client;

    constructor(client: Client, ui: Sidebar.UI) {
        super();
        this.client = client;
        this.ui = ui;
    }

    onClose(event: CloseEvent) {
        this.ui.clear();
    }

    onRecvHello(hello: Payload.Hello) {
        this.client.sendJSON({
            type: "FETCH_CLIENTS"
        });
    }

    onRecvClientList(data: Payload.ClientList) {
        this.ui.clear();
        for (let client of data.clients) {
            this.ui.addInitialIcon(client.name, client.nickname || client.name, client.name[0])
        }
    }

    onRecvStatus(status: Payload.Status) {
        switch (status.code) {
            case "CLIENT_JOINED":
                this.ui.addInitialIcon(status.name, status.nickname || status.name, status.name[0]);
                break;
            case "CLIENT_LEFT":
                this.ui.removeIcon(status.name);
                break;
        }
    }
}