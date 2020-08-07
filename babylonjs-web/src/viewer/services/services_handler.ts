import { EventHandler, ServiceEventHandler } from "../../concierge_api/handlers";
import Client from "../../concierge_api/mod";
import Payload, { GroupPayload } from "../../concierge_api/payloads";
import React from "react";
import Tabbed from "../../overlay/tabbed/mod";
import { ServicesTabComponent } from "./react";

export class ServicesHandler extends EventHandler {
    private static readonly TAB_ID = "services";
    private tab?: Tabbed.Tab;
    private groups: GroupPayload[] = [];
    private services: Map<string, ServiceEventHandler> = new Map();

    constructor(
        private readonly client: Client,
        private readonly tabComponent: Tabbed.Instance,
    ) {
        super();
        this.render();
    }

    onClose(_: CloseEvent) {
        this.tabComponent.removeTab(ServicesHandler.TAB_ID);
        this.tab = undefined;
        this.groups.length = 0;
    }

    onHello(_: Payload.Hello) {
        this.tab = this.tabComponent.addTab(ServicesHandler.TAB_ID, "Services");
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

    private addGroup(group: GroupPayload) {
        this.groups.push(group);
        this.render()
    }

    private removeGroup(name: string) {
        for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i].name == name) {
                this.groups.splice(i, 1);
                i--;
            }
        }
        this.render()
    }

    addService(handler: ServiceEventHandler) {
        this.services.set(handler.group, handler);
        this.client.addHandler(handler);
    }

    removeService(group: string) {
        let handler = this.services.get(group);
        if (handler) {
            this.services.delete(group);
            this.client.removeHandler(handler);
        }
    }

    subscribe(name: string) {
        let service = this.services.get(name);
        if (service) {
            service.subscribe();
        } {
            this.client.sendJSON({
                type: "SELF_SUBSCRIBE",
                name
            });
        }
    }

    unsubscribe(name: string) {
        let service = this.services.get(name);
        if (service) {
            service.unsubscribe();
        } {
            this.client.sendJSON({
                type: "SELF_UNSUBSCRIBE",
                name
            });
        }
    }

    render() {
        if (this.tab) {
            this.tab.reactContent = React.createElement(
                ServicesTabComponent,
                { handler: this, services: new Set(this.services.keys()), groups: this.groups }
            )
        }
    }
}

