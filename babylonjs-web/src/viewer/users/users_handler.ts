import { Sidebar } from "../../overlay/mod";
import { EventHandler } from "../../concierge_api/handlers";
import Client from "../../concierge_api/mod";
import Payload, { ClientPayload } from "../../concierge_api/payloads";
import React from "react";
import Tabbed from "../../overlay/tabbed/react";
import { UsersTabComponent } from "./react";

export class UsersHandler extends EventHandler {
    private tab?: Tabbed.Item;
    users: ClientPayload[] = [];

    constructor(
        private readonly client: Client,
        private readonly ui: Sidebar.Component,
        private readonly tabComponent: Tabbed.Component,
    ) {
        super();
        this.tab = this.tabComponent.addTab("users", "Users");
        this.render();
    }

    onClose(event: CloseEvent) {
        this.ui.clear();
        this.tabComponent.removeTab("users");
        this.tab = undefined;
        this.users.length = 0;
    }

    onHello(hello: Payload.Hello) {
        this.client.sendJSON({
            type: "CLIENT_FETCH_ALL"
        });
        this.render();
    }

    onClientFetchAllResult(data: Payload.ClientFetchAllResult) {
        this.ui.clear();
        for (let client of data.clients) {
            this.ui.addInitialIcon(client.uuid, client.nickname || client.name);
            this.users.push(client);
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

    addClient(client: ClientPayload) {
        this.ui.addInitialIcon(client.uuid, client.nickname || client.name);
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

