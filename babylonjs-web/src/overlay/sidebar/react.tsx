import "./style.scss";
import React from "react";
import Tippy from '@tippyjs/react';
import "tippy.js/dist/tippy.css";

export namespace Sidebar {
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
    
    interface ComponentProps {
        items?: Map<string, ImageIconProp | TextIconProp>
    }
    interface ComponentState {
        items: Map<string, ImageIconProp | TextIconProp>
    }
    export class Component extends React.PureComponent<ComponentProps, ComponentState> {
        constructor(props: ComponentProps) {
            super(props);
            this.state = { items: props.items || new Map() }
        }
    
        /**
         * Clear all icons in the sidebar.
         */
        clear() {
            let items = this.state.items;
            items.clear();
            this.setState({ items });
        }
    
        /**
         * Add an image-based icon to the sidebar.
         * @param name The full name of the icon.
         * @param imgSrc The source link of the image.
         */
        addImageIcon(id: string, name: string, imgSrc: string) {
            let items = this.state.items;
            items.set(id, {
                type: "IMAGE",
                name,
                imgSrc
            });
            this.setState({ items });
            this.forceUpdate();
        }
    
        private static hashString(str: string): number {
            var hash = 0, i, chr;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }
    
        /**
         * Add a text-based icon to the sidebar.
         * @param name The full name of the icon.
         * @param text The text of the icon.
         */
        addInitialIcon(id: string, name: string, text: string) {
            let rand = Component.hashString(name) % 360;
            let colorCss = `hsl(${rand}, 100%, 25%)`;
    
            let items = this.state.items;
            items.set(id, {
                type: "TEXT",
                name,
                colorCss
            });
            this.setState({ items });
            this.forceUpdate();
        }

        removeIcon(id: string) {
            let items = this.state.items;
            items.delete(id);
            this.setState({ items });
            this.forceUpdate();
        }
    
        render() {
            return <div className="sidebar">
                {Array.from(this.state.items.values(), prop => <Item {...prop}/>)}
            </div>;
        }
    }
    
    class Item extends React.PureComponent<ImageIconProp | TextIconProp> {
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
}

export default Sidebar;