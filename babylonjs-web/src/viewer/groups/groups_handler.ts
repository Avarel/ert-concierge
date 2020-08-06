import { EventHandler } from "../../concierge_api/handlers";
import Client from "../../concierge_api/mod";
import Payload, { GroupPayload } from "../../concierge_api/payloads";
import React from "react";
import Tabbed from "../../overlay/tabbed/react";
import { GroupsTabComponent } from "./react";

export class GroupsHandler extends EventHandler {
    private readonly tab: Tabbed.Item;
    groups: GroupPayload[] = [];

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

    onHello(hello: Payload.Hello) {
        this.client.sendJSON({
            type: "GROUP_FETCH_ALL"
        });
        this.render();
    }

    onGroupFetchAllResult(groupList: Payload.GroupFetchAllResult) {
        this.groups.length = 0;
        for (const group of groupList.groups) {
            this.addGroup(group);
        }
    }

    onGroupFetchResult(result: Payload.GroupFetchResult) {
        this.removeGroup(result.name);
        this.addGroup(result);
    }

    onStatus(status: Payload.Status) {
        switch (status.code) {
            case "GROUP_CREATED":
                this.client.sendJSON({
                    type: "GROUP_FETCH",
                    name: status.name
                });
                break;
            case "GROUP_DELETED":
                this.removeGroup(status.name);
                break;
        }
    }

    addGroup(group: GroupPayload) {
        this.groups.push(group);
        this.render()
    }

    removeGroup(name: string) {
        for (let i = 0; i < this.groups.length; i++) {
            console.log("Checking", this.groups[i].name);
            if (this.groups[i].name == name) {
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

