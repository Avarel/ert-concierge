import React from "react";

export module TabbedReact {
    interface TabProps {
        readonly id: string;
        readonly label: string;
        readonly jsxContent?: JSX.Element | null;
        readonly refobj?: React.RefObject<HTMLDivElement>;
    }

    namespace TabComponent {
        export function header(props: TabProps & { readonly component: Component }) {
            return <div className={`tabbed-header-label${props.component.isActive(props.id) ? " active" : ""}`}
                onClick={() => props.component.makeActive(props.id)}>
                {props.label}
            </div>
        }

        export function body(props: TabProps & { readonly component: Component }) {
            if (props.jsxContent || props.jsxContent === null) {
                if (props.component.isActive(props.id)) {
                    return <div className={`tabbed-body${props.component.isActive(props.id) ? " active" : ""}`} ref={props.refobj}>
                        {props.jsxContent}
                    </div>
                } else {
                    return null
                }
            } else {
                return <div className={`tabbed-body${props.component.isActive(props.id) ? " active" : ""}`} ref={props.refobj} />
            }
        }
    }

    interface ComponentProps {
        readonly contentHeight?: number;
        readonly reverseHeader?: boolean;
        readonly initShow?: boolean;
        readonly tabs: ReadonlyArray<TabProps>;
    }
    interface ComponentState {
        readonly shown: boolean,
        readonly activeId: string | undefined,
    }
    export class Component extends React.Component<ComponentProps, ComponentState> {
        constructor(props: ComponentProps) {
            super(props);
            this.state = { shown: props.initShow || false, activeId: props.tabs[0]?.id };
        }

        get isShown() {
            return this.state.shown && this.state.activeId;
        }

        isActive(id: string): boolean {
            return this.state.shown && this.state.activeId == id
        }

        toggleShown(value: boolean = !this.state.shown) {
            this.setState({ shown: value });
        }

        makeActive(id: string) {
            this.toggleShown(true);
            this.activeId = id;
        }

        get activeId(): string | undefined {
            return this.state.activeId;
        }

        set activeId(id: string | undefined) {
            this.setState({ activeId: id });
        }

        render() {
            return <div className={`tabbed${this.isShown ? "" : " hidden"}`}>
                <div className="tabbed-header" style={this.props.reverseHeader ? { flexDirection: "row-reverse" } : {}}>
                    <div className="tabbed-drawer" onClick={() => this.toggleShown()}>
                        <i className="fa fa-angle-double-down" />
                    </div>
                    {Array.from(this.props.tabs, props => <TabComponent.header component={this} {...props} />)}
                </div>
                <div className="tabbed-content" style={{ height: this.props.contentHeight }}>
                    {Array.from(this.props.tabs, props => <TabComponent.body component={this} {...props} />)}
                </div>
            </div>
        }
    }
}

export default TabbedReact;