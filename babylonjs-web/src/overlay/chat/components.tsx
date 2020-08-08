import "./style.scss";
import React from "react";

interface ChatProps {
    readonly items: ReadonlyArray<MessageProps | StatusProps>,
    readonly onSubmit?: (text: string) => void
}
export default class Chat extends React.Component<ChatProps> {
    private readonly messagesEndRef = React.createRef<HTMLDivElement>();

    constructor(props: ChatProps) {
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

export interface StatusProps {
    readonly type: "STATUS",
    readonly text: string
}
export interface MessageProps {
    readonly type: "MESSAGE",
    readonly name: string,
    readonly text: string,
    readonly you: boolean
}
export type EntryProps = StatusProps | MessageProps;

export class Entry extends React.PureComponent<EntryProps> {
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
    readonly text: string
}
export class Input extends React.PureComponent<InputProps, InputState> {
    constructor(props: InputProps) {
        super(props);
        this.state = { text: "" };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
            />
            <button className="chat-submit-btn" onClick={this.handleSubmit}>
                <i className="fa fa-paper-plane" />
            </button>
        </div>;
    }
}