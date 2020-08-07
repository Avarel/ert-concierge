import "./style.scss";
import React from "react";
import Tippy from '@tippyjs/react';
import "tippy.js/dist/tippy.css";

export namespace IconSidebarReact {
    interface IconProps {
        readonly label: string,
        readonly colorCss: string,
        readonly imgSrc?: string
    }
    
    interface ComponentProps {
        readonly icons: ReadonlyArray<IconProps>
    }
    export class Component extends React.PureComponent<ComponentProps> {
        constructor(props: ComponentProps) {
            super(props);
            this.state = { items: props.icons || new Map() }
        }

        icon(props: IconProps) {
            if (props.imgSrc) {
                return <div className="icon">
                     <img src={props.imgSrc}/>
                </div>
            } else {
                return <div className="icon">
                    <p style={{backgroundColor: props.colorCss}}>{props.label.charAt(0)}</p>
                </div>;
            }
        }
    
        render() {
            return <div className="sidebar">
                {Array.from(this.props.icons.values(), prop => <this.icon {...prop}/>)}
            </div>;
        }
    }
}

export default IconSidebarReact;