import Client, { Payload, RawHandler, ServiceEventHandler } from "../../concierge_api/mod";
import React from "react";
import Tabbed from "../../overlay/tabbed/mod";
import { ServicesTabComponent } from "./components";

export class ServicesHandler implements RawHandler {
    private static readonly TAB_ID = "services";
    private tab?: Tabbed.Tab;
    private groups: Payload.Info.Service[] = [];
    private services: Map<string, ServiceEventHandler<any>> = new Map();

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

    onReceive(payload: Readonly<Payload.Out>) {
        switch (payload.type) {
            case "HELLO":
                this.tab = this.tabComponent.addTab(ServicesHandler.TAB_ID, "Services");
                this.client.sendPayload({
                    type: "SERVICE_FETCH_ALL"
                }, payload => {
                    if (payload.type == "SERVICE_FETCH_ALL_RESULT") {
                        this.clear();
                        for (const group of payload.services) {
                            this.addGroup(group);
                        }
                    }
                });
                this.render();
                break;
            case "SERVICE_CREATE_RESULT":
                this.client.sendPayload({
                    type: "SERVICE_FETCH",
                    service: payload.service.name
                }, payload => {
                    if (payload.type == "SERVICE_FETCH_RESULT") {
                        this.addGroup(payload.service);
                    }
                });
                break;
            case "SERVICE_DELETE_RESULT":
                this.removeGroup(payload.service.name);
                break;
        }
    }

    private clear() {
        this.groups.length = 0;
    }

    private addGroup(group: Payload.Info.Service) {
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

    addService(handler: ServiceEventHandler<any>) {
        this.services.set(handler.serviceName, handler);
        this.client.addHandler(handler);
    }

    removeService(serviceName: string) {
        let handler = this.services.get(serviceName);
        if (handler) {
            this.services.delete(serviceName);
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
                service: name
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
                service: name
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

