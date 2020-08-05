import React from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface ImageIconProp {
    type: "IMAGE",
    name: string,
    imgSrc: string
}

interface TextIconProp {
    type: "TEXT",
    name: string,
    colorCss: string
}

interface SidebarComponentProps {
    items: (ImageIconProp | TextIconProp)[]
}
export class SidebarComponent extends React.PureComponent<SidebarComponentProps> {
    render() {
        return <React.Fragment>
            {this.props.items.map(prop => <SidebarItem {...prop}/>)}
        </React.Fragment>;
    }
}

class SidebarItem extends React.PureComponent<ImageIconProp | TextIconProp> {
    innerRender() {
        if (this.props.type == "TEXT") {
            return <div className="icon">
                <p style={{backgroundColor: this.props.colorCss}}>{this.props.name.charAt(0)}</p>
            </div>;
        } else {
            return <div className="icon">
                <img src={this.props.imgSrc}/>
            </div>
        }
    }

    render() {
        return <Tippy content={this.props.name} placement="right">
            {this.innerRender()}
        </Tippy>
    }
}