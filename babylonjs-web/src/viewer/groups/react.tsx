import Rs from "../../overlay/rstyle/react";
import React from "react";
import { GroupPayload } from "../../concierge_api/payloads";

class GroupComponent extends React.PureComponent<GroupPayload> {
    render() {
        if (this.props.nickname) {
            return <Rs.Card>
                <h2>{this.props.nickname}</h2>
                <p>{this.props.name}</p>
                <p>{this.props.owner_uuid}</p>
                <Rs.Row>
                    <button>A</button>
                    <button>B</button>
                </Rs.Row>
            </Rs.Card>;
        } else {
            return <Rs.Card>
                <h2>{this.props.name}</h2>
                <p>{this.props.owner_uuid}</p>
                <Rs.Row>
                    <button>A</button>
                    <button>B</button>
                </Rs.Row>
            </Rs.Card>;
        }
    }
}
interface GroupsTabComponentProps {
    readonly groups: ReadonlyArray<GroupPayload>
}
export class GroupsTabComponent extends React.Component<GroupsTabComponentProps> {
    render() {
        return <div className="rstyled full">
            <Rs.Pad light>
                <h1>Groups</h1>
            </Rs.Pad>
            <Rs.Pad style={{flexGrow: 1}}>
                {this.props.groups.map(props => <GroupComponent {...props}/>)}
            </Rs.Pad>
        </div>;
    }
}