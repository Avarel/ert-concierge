import React from "react";

interface TabbedComponentProps {
    readonly id: string;
    readonly label: string;
    readonly jsxContent?: JSX.Element | null;
    readonly refobj?: React.RefObject<HTMLDivElement>;
}

type TabComponentProps = TabbedComponentProps & { readonly component: Tabbed };
export class TabbedHeader extends React.Component<TabComponentProps> {
    render() {
        return <div className={`tabbed-header-label${this.props.component.isActive(this.props.id) ? " active" : ""}`}
            onClick={() => this.props.component.makeActive(this.props.id)}>
            {this.props.label}
        </div>
    }
}

export class TabbedBody extends React.Component<TabComponentProps> {
    render() {
        if (this.props.jsxContent || this.props.jsxContent === null) {
            if (this.props.component.isActive(this.props.id)) {
                return <div className={`tabbed-body${this.props.component.isActive(this.props.id) ? " active" : ""}`} ref={this.props.refobj}>
                    {this.props.jsxContent}
                </div>
            } else {
                return null
            }
        } else {
            return <div className={`tabbed-body${this.props.component.isActive(this.props.id) ? " active" : ""}`} ref={this.props.refobj} />
        }
    }
}

interface TabbedProps {
    readonly contentHeight?: number;
    readonly reverseHeader?: boolean;
    readonly initShow?: boolean;
    readonly tabs: ReadonlyArray<TabbedComponentProps>;
}
interface TabbedState {
    readonly shown: boolean,
    readonly activeId: string | undefined,
}
export default class Tabbed extends React.Component<TabbedProps, TabbedState> {
    constructor(props: TabbedProps) {
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
                {Array.from(this.props.tabs, props => <TabbedHeader component={this} {...props} />)}
            </div>
            <div className="tabbed-content" style={{ height: this.props.contentHeight }}>
                {Array.from(this.props.tabs, props => <TabbedBody component={this} {...props} />)}
            </div>
        </div>
    }
}