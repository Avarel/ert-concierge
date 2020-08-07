import Rs from "../../overlay/rstyle/react";
import { ClientPayload } from "../../concierge_api/payloads";
import React from "react";

class UserComponent extends React.PureComponent<ClientPayload> {
    render() {
        if (this.props.nickname) {
            return <Rs.Card>
                <h2>{this.props.nickname}</h2>
                <Rs.InputValue label="Name" inputs={[{value: this.props.name}]}/>
                <Rs.InputValue label="UUID" inputs={[{value: this.props.uuid}]}/>
                <Rs.InputValue label="Tags" inputs={[{value: this.props.tags}]}/>
            </Rs.Card>;
        } else {
            return <Rs.Card>
                <h2>{this.props.name}</h2>
                <Rs.InputValue label="UUID" inputs={[{value: this.props.uuid}]}/>
                <Rs.InputValue label="Tags" inputs={[{value: this.props.tags}]}/>
            </Rs.Card>;
        }
    }
}

interface UsersTabComponentProps {
    readonly name: string,
    readonly uuid: string,
    readonly users: ReadonlyArray<ClientPayload>
}
export class UsersTabComponent extends React.Component<UsersTabComponentProps> {

    render() {
        return <div className="rstyled full">
            <Rs.Pad light>
                <h1>Clients</h1>
                <p>Clients connected to the server.</p>
            </Rs.Pad>
            <Rs.Pad style={{flexGrow: 1}}>
                {this.props.users.map(prop =>  <UserComponent {...prop}/>)}
            </Rs.Pad>
        </div>;
    }
}