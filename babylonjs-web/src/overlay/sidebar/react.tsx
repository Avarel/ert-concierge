import "./style.scss";
import Tippy from '@tippyjs/react';
import "tippy.js/dist/tippy.css";
import React from "react";

export namespace IconSidebarReact {
    interface IconProps {
        readonly label: string,
        readonly colorCss: string,
        readonly imgSrc?: string
    }

    export class Icon extends React.PureComponent<IconProps> {
        render() {
            if (this.props.imgSrc) {
                return <div className="icon">
                        <img src={this.props.imgSrc}/>
                </div>
            } else {
                return <div className="icon">
                    <p style={{backgroundColor: this.props.colorCss}}>{this.props.label.charAt(0)}</p>
                </div>;
            }
        }
    }
    
    interface ComponentProps {
        readonly icons: ReadonlyArray<IconProps>
    }
    export class Component extends React.PureComponent<ComponentProps> {
        constructor(props: ComponentProps) {
            super(props);
            this.state = { items: props.icons || new Map() }
        }

        render() {
            return <div className="sidebar">
                {Array.from(this.props.icons.values(), prop => <Tippy content={prop.label}>
                    <Icon {...prop}/>
                </Tippy>)}
            </div>;
        }
    }
}

export default IconSidebarReact;