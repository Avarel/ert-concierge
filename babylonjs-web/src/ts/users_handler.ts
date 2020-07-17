import * as ConciergeAPI from "./concierge_api";
import { EventHandler } from "./concierge_api";
import { Sidebar } from "./overlay";

export class UsersHandler extends EventHandler {
    readonly ui: Sidebar.UI;
    readonly client: ConciergeAPI.Client;

    constructor(client: ConciergeAPI.Client, ui: Sidebar.UI) {
        super();
        this.client = client;
        this.ui = ui;
    }

    onRecvHello(hello: ConciergeAPI.Payloads.Hello) {
        this.client.sendJSON({
            type: "FETCH_CLIENTS"
        });
    }

    onRecvClientList(data: ConciergeAPI.Payloads.ClientList) {
        this.ui.clear();
        for (let client of data.clients) {
            this.ui.addInitialIcon(client.name, client.name[0])
        }
    }

    onRecvStatus(status: ConciergeAPI.Payloads.Status) {
        switch (status.code) {
            case "CLIENT_JOINED":
                this.ui.addInitialIcon(status.name, status.name[0]);
                break;
            case "CLIENT_LEFT":
                this.ui.removeIcon(status.name);
                break;
        }
    }
}