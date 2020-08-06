import Rs from "../../overlay/rstyle/react";
import React from "react";

class GroupComponent extends React.PureComponent<{name: string}> {
    render() {
        return <Rs.Card>
            <h2>{this.props.name}</h2>
            <Rs.Row>
                <button>Subscribe</button>
                <button>Unsubscribe</button>
            </Rs.Row>
        </Rs.Card>;
    }
}
interface GroupsTabComponentProps {
    readonly groups: ReadonlyArray<string>
}
export class GroupsTabComponent extends React.PureComponent<GroupsTabComponentProps> {
    render() {
        return <div className="rstyled full">
            <Rs.Pad light>
                <h1>Groups</h1>
            </Rs.Pad>
            <Rs.Pad style={{flexGrow: 1}}>
                {this.props.groups.map(group => <GroupComponent name={group}/>)}
            </Rs.Pad>
        </div>;
    }
}