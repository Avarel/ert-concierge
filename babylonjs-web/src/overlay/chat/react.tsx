import "./style.scss";
import React from "react";

export module Chat {
    interface ComponentProps {
        readonly items: ReadonlyArray<Message | Status>,
        readonly onSubmit?: (text: string) => void
    }
    export class Component extends React.Component<ComponentProps> {
        messagesEndRef = React.createRef<HTMLDivElement>()

        constructor(props: ComponentProps) {
            super(props);
        }

        componentDidUpdate() {
            const element = this.messagesEndRef.current;
            if (element) {
                element.scrollTop = element.scrollHeight;
            }
        }

        set onSubmit(callback: ((text: string) => void) | undefined) {
            this.setState({ onSubmit: callback });
        }

        render() {
            return <div className="chat-container">
                <div className="chat-messages" ref={this.messagesEndRef}>
                    {this.props.items.map(it => <Entry {...it} />)}
                </div>
                <Input onSubmit={this.props.onSubmit}/>
            </div>
        }
    }

    export interface Status {
        readonly type: "STATUS",
        readonly text: string
    }
    export interface Message {
        readonly type: "MESSAGE",
        readonly name: string,
        readonly text: string,
        readonly you: boolean
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

    interface InputProps {
        readonly onSubmit?: (text: string) => void
    }
    interface InputState {
        text: string
    }
    class Input extends React.PureComponent<InputProps, InputState> {
        constructor(props: InputProps) {
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
            this.setState((state, props) => {
                if (state.text) {
                    props.onSubmit?.(state.text)
                }
                return { text: "" }
            })
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