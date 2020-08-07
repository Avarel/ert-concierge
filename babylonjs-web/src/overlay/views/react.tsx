import React from "react";

export module ViewsReact {
    interface ViewProps {
        readonly jsxContent?: JSX.Element | null;
        readonly refobj?: React.RefObject<HTMLDivElement>;
    }
    interface ComponentProps {
        readonly views: ReadonlyArray<ViewProps>;
    }

    export class ViewComponent extends React.Component<ViewProps> {
        render() {
            return <div className="view" ref={this.props.refobj}>
                {this.props.jsxContent}
            </div>
        }
    }

    export class Component extends React.Component<ComponentProps> {
        render() {
            return <div className="views">
                {Array.from(this.props.views, props => {
                    return <ViewComponent {...props} />
                })}
            </div>
        }
    }
}

export default ViewsReact;