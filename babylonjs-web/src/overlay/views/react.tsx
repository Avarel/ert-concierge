import React from "react";

export namespace ViewsReact {
    interface ViewProps {
        readonly jsxContent?: JSX.Element | null;
        readonly refobj?: React.RefObject<HTMLDivElement>;
    }
    interface ComponentProps {
        readonly views: ReadonlyArray<ViewProps>;
    }
    export class Component extends React.Component<ComponentProps> {
        view(props: ViewProps) {
            return <div className="view" ref={props.refobj}>
                { props.jsxContent }
            </div>
        }

        render() {
            return <div className="views">
                {Array.from(this.props.views, props => {
                    return <this.view {...props} />
                })}
            </div>
        }
    }
}