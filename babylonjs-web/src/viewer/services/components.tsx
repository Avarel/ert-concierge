import Rs from "../../overlay/rstyle/components";
import React from "react";
import { Payload } from "../../concierge_api/mod";
import { ServicesHandler } from "./services_handler";

interface GroupComponentProps extends Payload.Info.Service {
    readonly isService: boolean,
    readonly handler: ServicesHandler
}
class GroupComponent extends React.PureComponent<GroupComponentProps> {
    innerRender() {
        if (this.props.nickname) {
            return <React.Fragment>
                <h2>{this.props.nickname}</h2>
                <Rs.InputValue label="Name" inputs={[{ value: this.props.name }]} />
                <Rs.InputValue label="Owner UUID" inputs={[{ value: this.props.owner_uuid }]} />
            </React.Fragment>;
        } else {
            return <React.Fragment>
                <h2>{this.props.name}</h2>
                <Rs.InputValue label="Owner UUID" inputs={[{ value: this.props.owner_uuid }]} />
            </React.Fragment>;
        }
    }

    render() {
        return <Rs.Card>
            {this.innerRender()}
            <Rs.Row>
                {
                    this.props.isService ? <React.Fragment>
                        <button onClick={() => this.props.handler.subscribe(this.props.name)}>Subscribe</button>
                        <button onClick={() => this.props.handler.unsubscribe(this.props.name)}>Unsubscribe</button>
                    </React.Fragment> : null
                }
            </Rs.Row>
        </Rs.Card>;
    }
}
interface GroupsTabComponentProps {
    readonly handler: ServicesHandler,
    readonly services: ReadonlySet<string>
    readonly groups: ReadonlyArray<Payload.Info.Service>
}
export class ServicesTabComponent extends React.Component<GroupsTabComponentProps> {
    render() {
        return <div className="rstyled full">
            <Rs.Pad light>
                <h1>Services</h1>
                <p>List of services currently available on the server.</p>
            </Rs.Pad>
            <Rs.Pad style={{ flexGrow: 1 }}>
                {this.props.groups.map(props => <GroupComponent
                    handler={this.props.handler}
                    isService={this.props.services.has(props.name)}
                    {...props}
                />)}
            </Rs.Pad>
        </div>;
    }
}