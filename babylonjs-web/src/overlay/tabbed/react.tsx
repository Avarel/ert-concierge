import "./style.scss";
import React from "react";

export namespace Tabbed {
    export class Item {
        /** 
         * The difference between null and undefined here is **very important**.
         * If the value is null or present, then the tab body is in React mode.
         * This means that if the tab is not active, it will not be drawn and completely
         * removed from the DOM. This makes it easier on the browser hierarchy and allows
         * for React to leverage its full power.
         * 
         * If the value is undefined, then the tab body is always rendered, even though
         * it might be hidden since it is not active. In this case, manipulation of the
         * tab content should use {@link WindowTab#htmlElement}. Using the field will
         * automatically turn the tab into raw mode and set this field to undefined.
         * 
         * By default, the value is null when constructed from {@link Tabbed.Component}.
         */
        private jsxContent?: JSX.Element | null = null;
        private readonly ref = React.createRef<HTMLDivElement>();

        constructor(
            private readonly parent: Component,
            readonly tag: string,
            readonly name: string
        ) {
            this.renderHeader = this.renderHeader.bind(this);
            this.renderBody = this.renderBody.bind(this);
            this.makeActive = this.makeActive.bind(this);
        }

        get htmlElement(): HTMLDivElement | null {
            this.jsxContent = undefined;
            return this.ref.current;
        }

        get isActive(): boolean {
            return this.parent.state.activeTag == this.tag && this.parent.state.shown
        }

        makeActive() {
            if (!this.parent.state.shown) {
                this.parent.toggleShown();
            }
            this.parent.setActive(this.tag);
        }

        /**
         * Sets the content and force an update on the parent tab container.
         */
        set reactContent(content: JSX.Element | null | undefined) {
            this.jsxContent = content;
            this.parent.forceUpdate();
        }

        renderHeader() {
            return <div className={`tabbed-header-label${this.isActive ? " active" : ""}`} onClick={this.makeActive}>
                {this.name}
            </div>
        }

        renderBody() {
            if (this.jsxContent || this.jsxContent === null) {
                if (this.isActive && this.parent.state.shown) {
                    return <div className={`tabbed-body${this.isActive ? " active" : ""}`} ref={this.ref}>
                        {this.jsxContent}
                    </div>
                } else {
                    return null
                }
            } else {
                return <div className={`tabbed-body${this.isActive ? " active" : ""}`} ref={this.ref} />
            }
        }
    }

    interface ComponentProps {
        readonly contentHeight?: number;
        readonly reverseHeader?: boolean;
    }
    interface ComponentState {
        readonly shown: boolean,
        readonly activeTag: string | undefined,
        readonly tabs: ReadonlyMap<string, Item>
    }

    interface StaticTabProps {
        readonly tag: string,
        readonly name: string
    }
    export class StaticTab extends React.Component<StaticTabProps> {
        // dummy component
    }

    export class Component extends React.Component<ComponentProps, ComponentState> {
        constructor(props: ComponentProps) {
            super(props);

            let tabs = new Map();

            React.Children.forEach(this.props.children, (child: any) => {
                if (child.type == StaticTab) {
                    let props = child.props;
                    let tab = new Item(this, props.tag, props.name);
                    if (props.children) {
                        tab.reactContent = props.children;
                    }
                    tabs.set(tab.tag, tab);
                }
            });

            this.state = { shown: true, activeTag: undefined, tabs }
        }

        addTab(tag: string, name: string): Item {
            let tab = new Item(this, tag, name);

            this.setState(state => {
                if (state.tabs.has(tag)) {
                    throw new Error(`"${tag}" is not a registered tag in the component.`);
                }
                let tabs = new Map(state.tabs);
                tabs.set(tag, tab);

                // Finds and a tab active if there is no active tab.
                let activeTag = state.activeTag;
                if (!activeTag) {
                    let tag = tabs.keys().next().value;
                    activeTag = tag;
                }
                
                return { activeTag, tabs };
            });

            return tab;
        }

        removeTab(tag: string) {
            this.setState(state => {
                if (!state.tabs.has(tag)) {
                    throw new Error(`"${tag}" is not a registered tag in the component.`);
                }
    
                let tabs = new Map(state.tabs);
                tabs.delete(tag);

                // Finds and a tab active if there is no active tab.
                let activeTag = state.activeTag;
                if (activeTag == tag) {
                    let tag = tabs.keys().next().value;
                    activeTag = tag;
                }

                return { activeTag, tabs }
            });
        }

        getTab(tag: string): Item | undefined {
            return this.state.tabs.get(tag)
        }

        setActive(activeTag: string) {
            this.setState(state => {
                if (!state.tabs.has(activeTag)) {
                    throw new Error(`"${activeTag}" is not a registered tag in the component.`);
                }
                return { activeTag }
            });
        }

        toggleShown(value: boolean = !this.state.shown) {
            this.setState({ shown: value });
        }

        get isShown() {
            return this.state.shown && this.state.activeTag;
        }

        render() {
            return <div className={`tabbed${this.isShown ? "" : " hidden"}`}>
                <div className="tabbed-header" style={this.props.reverseHeader ? { flexDirection: "row-reverse" } : {}}>
                    <div className="tabbed-drawer" onClick={() => this.toggleShown()}>
                        <i className="fa fa-angle-double-down" />
                    </div>
                    {Array.from(this.state.tabs.values(), tab => <tab.renderHeader />)}
                </div>
                <div className="tabbed-content" style={{ height: this.props.contentHeight }}>
                    {Array.from(this.state.tabs.values(), tab => <tab.renderBody />)}
                </div>
            </div>
        }
    }
}

export default Tabbed;