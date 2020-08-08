import Client, { Payload, RawHandler, ServiceEventHandler } from "../../concierge_api/mod";
import React from "react";
import Tabbed from "../../overlay/tabbed/mod";
import { ServicesTabComponent } from "./components";

export class ServicesHandler implements RawHandler {
    private static readonly TAB_ID = "services";
    private tab?: Tabbed.Tab;
    private groups: Payload.Info.Group[] = [];
    private services: Map<string, ServiceEventHandler> = new Map();

    constructor(
        private readonly client: Client,
        private readonly tabComponent: Tabbed.Instance,
    ) {
        this.render();
    }

    onClose(_: CloseEvent) {
        this.tabComponent.removeTab(ServicesHandler.TAB_ID);
        this.tab = undefined;
        this.groups.length = 0;
    }

    onReceive(payload: Readonly<Payload.Any<any>>) {
        switch (payload.type) {
            case "HELLO":
                this.tab = this.tabComponent.addTab(ServicesHandler.TAB_ID, "Services");
                this.client.sendPayload({
                    type: "GROUP_FETCH_ALL"
                }, payload => {
                    if (payload.type == "GROUP_FETCH_ALL_RESULT") {
                        this.clear();
                        for (const group of payload.groups) {
                            this.addGroup(group);
                        }
                    }
                });
                this.render();
                break;
            case "STATUS":
                switch (payload.code) {
                    case "GROUP_CREATED":
                        this.client.sendPayload({
                            type: "GROUP_FETCH",
                            name: payload.name
                        }, payload => {
                            if (payload.type == "GROUP_FETCH_RESULT") {
                                this.addGroup(payload);
                            }
                        });
                        break;
                    case "GROUP_DELETED":
                        this.removeGroup(payload.name);
                        break;
                }
                break;
        }
    }

    private clear() {
        this.groups.length = 0;
    }

    private addGroup(group: Payload.Info.Group) {
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
            this.client.sendPayload({
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
            this.client.sendPayload({
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

