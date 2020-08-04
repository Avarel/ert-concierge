import React from "react";

interface ChatComponentProps {
    items: (MessageProp | StatusProp)[],
    onSubmit?: (text: string) => void
}
export class ChatComponent extends React.Component<ChatComponentProps> {
    messagesEndRef = React.createRef<HTMLDivElement>()

    componentDidUpdate() {
        const element = this.messagesEndRef.current;
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }

    render() {
        return <div className="chat-container">
            <div className="chat-messages" ref={this.messagesEndRef}>
                {this.props.items.map(it => <ChatEntry {...it} />)}
            </div>
            <ChatInput onSubmit={this.props.onSubmit}/>
        </div>
    }
}

interface StatusProp {
    type: "STATUS",
    text: string
}
interface MessageProp {
    type: "MESSAGE",
    name: string,
    text: string,
    you: boolean
}
class ChatEntry extends React.PureComponent<MessageProp | StatusProp> {
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

interface ChatInputProp {
    onSubmit?: (text: string) => void
}
interface ChatInputState {
    text: string
}
class ChatInput extends React.Component<ChatInputProp, ChatInputState> {
    constructor(props: ChatInputProp) {
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