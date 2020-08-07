import { IconSidebar } from "../../overlay/mod";
import { EventHandler } from "../../concierge_api/handlers";
import Client from "../../concierge_api/mod";
import Payload, { ClientPayload } from "../../concierge_api/payloads";
import React from "react";
import Tabbed from "../../overlay/tabbed/mod";
import { UsersTabComponent } from "./react";

export class ClientsHandler extends EventHandler {
    private static readonly TAB_ID = "clients";
    private tab?: Tabbed.Tab;
    users: ClientPayload[] = [];

    constructor(
        private readonly client: Client,
        private readonly ui: IconSidebar.Instance,
        private readonly tabComponent: Tabbed.Instance,
    ) {
        super();
        this.tab = this.tabComponent.addTab(ClientsHandler.TAB_ID, "Clients");
        this.render();
    }

    onClose(event: CloseEvent) {
        this.ui.clear();
        this.tabComponent.removeTab(ClientsHandler.TAB_ID);
        this.tab = undefined;
        this.clear();
    }

    onHello(hello: Payload.Hello) {
        this.client.sendJSON({
            type: "CLIENT_FETCH_ALL"
        });
        this.render();
    }

    onClientFetchAllResult(data: Payload.ClientFetchAllResult) {
        this.clear();
        for (let client of data.clients) {
            this.addClient(client);
        }
    }

    onStatus(status: Payload.Status) {
        switch (status.code) {
            case "CLIENT_JOINED":
                this.addClient(status);
                break;
            case "CLIENT_LEFT":
                this.removeUser(status.uuid);
                break;
        }
    }

    clear() {
        this.users.length = 0;
    }

    addClient(client: ClientPayload) {
        this.ui.addIcon(client.uuid, client.nickname || client.name);
        this.users.push(client);
        this.render()
    }

    removeUser(uuid: string) {
        this.ui.removeIcon(uuid);
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].uuid == uuid) {
                this.users.splice(i, 1);
                i--;
            }
        }
        this.render()
    }

    render() {
        if (this.tab) {
            this.tab.reactContent = React.createElement(
                UsersTabComponent,
                { name: this.client.name, uuid: this.client.uuid, users: this.users }
            )
        }
    }
}

