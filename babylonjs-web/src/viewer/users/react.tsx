import Rs from "../../overlay/rstyle/react";
import { ClientPayload } from "../../concierge_api/payloads";
import React from "react";

class UserComponent extends React.PureComponent<ClientPayload> {
    render() {
        if (this.props.nickname) {
            return <Rs.Card>
                <h2>{this.props.nickname}</h2>
                <p>{this.props.name}</p>
                <p>{this.props.uuid}</p>
                <Rs.Card>{this.props.tags}</Rs.Card>
            </Rs.Card>;
        } else {
            return <Rs.Card>
                <h2>{this.props.name}</h2>
                <p>{this.props.uuid}</p>
                <Rs.Card>{this.props.tags}</Rs.Card>
            </Rs.Card>;
        }
    }
}
interface UsersTabComponentProps {
    readonly name: string,
    readonly uuid: string,
    readonly users: ReadonlyArray<ClientPayload>
}
export class UsersTabComponent extends React.PureComponent<UsersTabComponentProps> {
    render() {
        return <div className="rstyled full">
            <Rs.Pad light>
                <h1>{this.props.name}</h1>
                <p>{this.props.uuid}</p>
            </Rs.Pad>
            <Rs.Pad style={{flexGrow: 1}}>
                {this.props.users.map(prop =>  <UserComponent {...prop}/>)}
            </Rs.Pad>
        </div>;
    }
}