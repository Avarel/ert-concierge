import "./style.scss";
import React from "react";

export module Chat {
    interface ComponentProps {
        readonly items?: (Message | Status)[],
        readonly onSubmit?: (text: string) => void
    }
    interface ComponentState {
        readonly items: (Message | Status)[],
        readonly onSubmit?: (text: string) => void
    }
    export class Component extends React.Component<ComponentProps, ComponentState> {
        messagesEndRef = React.createRef<HTMLDivElement>()

        constructor(props: ComponentProps) {
            super(props);
            this.state = { items: props.items || [] };
        }

        componentDidUpdate() {
            const element = this.messagesEndRef.current;
            if (element) {
                element.scrollTop = element.scrollHeight;
            }
        }

        set onSubmit(callback: ((text: string) => void) | undefined) {
            this.setState({ items: this.state.items, onSubmit: callback });
        }

        addStatus(text: string) {
            let items = this.state.items;
            items.push({
                type: "STATUS",
                text,
            });

            this.setState({ items, onSubmit: this.state.onSubmit });
            this.forceUpdate();
        }

        addMessage(name: string, text: string, you: boolean = false) {
            let items = this.state.items;
            items.push({
                type: "MESSAGE",
                name,
                text,
                you
            });

            this.setState({ items, onSubmit: this.state.onSubmit });
            this.forceUpdate();
        }

        render() {
            return <div className="chat-container">
                <div className="chat-messages" ref={this.messagesEndRef}>
                    {this.state.items.map(it => <Entry {...it} />)}
                </div>
                <Input onSubmit={this.state.onSubmit}/>
            </div>
        }
    }

    export interface Status {
        readonly type: "STATUS",
        text: string
    }
    export interface Message {
        readonly type: "MESSAGE",
        name: string,
        text: string,
        you: boolean
    }
    export type Item = Status | Message;

    class Entry extends React.PureComponent<Message | Status> {
        render() {
            if (this.props.type == "MESSAGE") {
                return <div className={`chat-item${this.props.you ? " you" : ""}`}>
                    <div className="name">{this.props.name}</div>
                    <div className="text">{this.props.text}</div>
                </div>
            } else {
                return <div className="chat-item status">
                    <div className="text">{this.props.text}</div>
                </div>
            }
        }
    }

    interface InputProp {
        readonly onSubmit?: (text: string) => void
    }
    interface InputState {
        text: string
    }
    class Input extends React.PureComponent<InputProp, InputState> {
        constructor(props: InputProp) {
            super(props);
            this.state = { text: "" };
        }

        handleChange(event: React.ChangeEvent<HTMLInputElement>) {
            this.setState({ text: event.target.value });
        }

        handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.handleSubmit();
            }
        }

        handleSubmit() {
            if (this.state.text) {
                this.setState({ text: "" })
                this.props.onSubmit?.(this.state.text)
            }
        }

        render() {
            return <div className="chat-input">
                <input className="chat-input-field" type="text" 
                    placeholder="Text message..." value={this.state.text}
                    onChange={event => this.handleChange(event)}
                    onKeyDown={event => this.handleKeyDown(event)}
                />
                <button className="chat-submit-btn" onClick={() => this.handleSubmit()}>
                    <i className="fa fa-paper-plane" />
                </button>
            </div>;
        }
    }
}

export default Chat;