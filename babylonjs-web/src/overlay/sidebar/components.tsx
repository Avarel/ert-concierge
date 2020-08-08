import "./style.scss";
import React from "react";
import Tippy from '@tippyjs/react';
import "tippy.js/dist/tippy.css";

interface IconProps {
    readonly label: string,
    readonly colorCss: string,
    readonly imgSrc?: string
}

export class Icon extends React.PureComponent<IconProps> {
    innerRender() {
        if (this.props.imgSrc) {
            return <div className="icon">
                <img src={this.props.imgSrc} />
            </div>
        } else {
            return <div className="icon">
                <p style={{ backgroundColor: this.props.colorCss }}>{this.props.label.charAt(0)}</p>
            </div>
        }
    }

    render() {
        return <Tippy content={this.props.label} placement="right">
            {this.innerRender()}
        </Tippy>
    }
}

interface IconSidebarProps {
    readonly icons: ReadonlyArray<IconProps>
}
export default class IconSidebarComponent extends React.PureComponent<IconSidebarProps> {
    constructor(props: IconSidebarProps) {
        super(props);
        this.state = { items: props.icons || new Map() }
    }

    render() {
        return <div className="sidebar">
            {Array.from(this.props.icons.values(), prop => <Icon {...prop} />)}
        </div>;
    }
}