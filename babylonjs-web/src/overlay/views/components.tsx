import React from "react";

interface ViewProps {
    readonly jsxContent?: JSX.Element | null;
    readonly refobj?: React.RefObject<HTMLDivElement>;
}
export class View extends React.Component<ViewProps> {
    render() {
        return <div className="view" ref={this.props.refobj}>
            {this.props.jsxContent}
        </div>
    }
}

interface ViewsProps {
    readonly views: ReadonlyArray<ViewProps>;
}
export default class Views extends React.Component<ViewsProps> {
    render() {
        return <div className="views">
            {Array.from(this.props.views, props => {
                return <View {...props} />
            })}
        </div>
    }
}