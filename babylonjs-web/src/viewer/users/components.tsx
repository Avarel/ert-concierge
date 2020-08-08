import Rs from "../../overlay/rstyle/components";
import { Payload } from "../../concierge_api/mod";
import React from "react";

class UserComponent extends React.PureComponent<Payload.Info.Client> {
    innerRender() {
        if (this.props.nickname) {
            return <React.Fragment>
                <h2>{this.props.nickname}</h2>
                <Rs.InputValue label="Name" inputs={[{ value: this.props.name }]} />
            </React.Fragment>
        } else {
            return <h2>{this.props.name}</h2>
        }
    }

    render() {
        return <Rs.Card>
            {this.innerRender()}
            <Rs.InputValue label="UUID" inputs={[{ value: this.props.uuid }]} />
            <Rs.InputValue label="Tags" inputs={[{ value: this.props.tags }]} />
        </Rs.Card>;
    }
}

interface UsersTabComponentProps {
    readonly name: string,
    readonly uuid: string,
    readonly users: ReadonlyArray<Payload.Info.Client>
}
export class UsersTabComponent extends React.Component<UsersTabComponentProps> {

    render() {
        return <div className="rstyled full">
            <Rs.Pad light>
                <h1>Clients</h1>
                <p>Clients connected to the server.</p>
            </Rs.Pad>
            <Rs.Pad style={{ flexGrow: 1 }}>
                {this.props.users.map(prop => <UserComponent {...prop} />)}
            </Rs.Pad>
        </div>;
    }
}