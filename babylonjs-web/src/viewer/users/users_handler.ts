import { IconSidebar } from "../../overlay/mod";
import Client, { RawHandler, Payload } from "../../concierge_api/mod";
import React from "react";
import Tabbed from "../../overlay/tabbed/mod";
import { UsersTabComponent } from "./components";

export class ClientsHandler implements RawHandler {
    private static readonly TAB_ID = "clients";
    private tab?: Tabbed.Tab;
    users: Payload.Info.Client[] = [];

    constructor(
        private readonly client: Client,
        private readonly ui: IconSidebar.Instance,
        private readonly tabComponent: Tabbed.Instance,
    ) {
        this.tab = this.tabComponent.addTab(ClientsHandler.TAB_ID, "Clients");
        this.render();
    }

    onClose(_: CloseEvent) {
        this.ui.clear();
        this.tabComponent.removeTab(ClientsHandler.TAB_ID);
        this.tab = undefined;
        this.clear();
    }

    onReceive(payload: Readonly<Payload.Out>) {
        switch (payload.type) {
            case "HELLO":
                this.client.sendPayload({
                    type: "CLIENT_FETCH_ALL"
                }, payload => {
                    if (payload.type == "CLIENT_FETCH_ALL_RESULT") {
                        this.clear();
                        for (const client of payload.clients) {
                            this.addClient(client);
                        }
                    }
                });
                this.render();
                break;
            case "CLIENT_JOINED":
                this.addClient(payload.client);
                break;
            case "CLIENT_LEFT":
                this.removeUser(payload.client.uuid);
                break;
        }
    }

    clear() {
        this.users.length = 0;
    }

    addClient(client: Payload.Info.Client) {
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

