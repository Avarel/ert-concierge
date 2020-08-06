import { Sidebar } from "../../overlay/mod";
import { EventHandler } from "../../concierge_api/handlers";
import Client from "../../concierge_api/mod";
import Payload, { ClientPayload } from "../../concierge_api/payloads";
import React from "react";
import Tabbed from "../../overlay/tabbed/react";
import { GroupsTabComponent } from "./react";

export class GroupsHandler extends EventHandler {
    private readonly tab: Tabbed.Item;
    groups: string[] = [];

    constructor(
        private readonly client: Client,
        private readonly tabComponent: Tabbed.Component,
    ) {
        super();
        this.tab = this.tabComponent.addTab("groups", "Groups");
        this.render();
    }

    onClose(event: CloseEvent) {
        this.groups.length = 0;
    }

    onRecvHello(hello: Payload.Hello) {
        this.client.sendJSON({
            type: "FETCH_GROUPS"
        });
        this.render();
    }

    onRecvGroupList(groupList: Payload.GroupList) {
        for (const group of groupList.groups) {
            this.addGroup(group);
        }
    }

    onRecvStatus(status: Payload.Status) {
        switch (status.code) {
            case "GROUP_CREATED":
                this.addGroup(status.group);
                break;
            case "GROUP_DELETED":
                this.removeGroup(status.group);
                break;
        }
    }

    addGroup(group: string) {
        this.groups.push(group);
        this.render()
    }

    removeGroup(group: string) {
        for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i] == group) {
                this.groups.splice(i, 1);
                i--;
            }
        }
        this.render()
    }

    render() {
        this.tab.reactContent = React.createElement(
            GroupsTabComponent,
            { groups: this.groups }
        )
    }
}

