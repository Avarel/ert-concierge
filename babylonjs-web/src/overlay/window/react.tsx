import React from "react";

export class TabHeader extends React.PureComponent {
    render() {
        return <div className="window-tab-header">
            {this.props.children}
        </div>;
    }
}

export class TabBody extends React.PureComponent {
    render() {
        return <div className="window-tab-body">
            {this.props.children}
        </div>;
    }
}

export class TabBox extends React.PureComponent {
    render() {
        return <div className="window-tab-box">
            {this.props.children}
        </div>;
    }
}

interface EntryInput {
    tag?: string,
    value: any
}
interface EntryProps {
    name: string,
    inputs: EntryInput[],
    readOnly?: true,
    onSubmit?: (tag: string, value: string) => void,
}
interface EntryState {
    values: any[]
}
export class Entry extends React.Component<EntryProps, EntryState> {
    constructor(props: EntryProps) {
        super(props);
        this.state = { values: props.inputs.map(_ => undefined) };
    }

    handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (event.keyCode === 13) {
            event.preventDefault();
            const tag = this.props.inputs[index].tag;
            if (!tag) return;
            const originalValue = this.props.inputs[index].value;
            const value = this.state.values[index];
            if (value && value != originalValue) {
                this.props.onSubmit?.(tag, value);
                this.state.values[index] = undefined;
            }
        }
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value = event.currentTarget.value;
        const originalValue = this.props.inputs[index].value;
        if (value == originalValue) {
            value == undefined;
        }
        this.setState(state => {
            state.values[index] = value;
            return state
        });
    }

    render() {
        return <div className="entry">
            <div className="name">{this.props.name}</div>
            <div className="value">
                {
                    this.props.inputs.map(({ tag, value }, index) =>
                        <input
                            readOnly={tag == undefined}
                            value={!this.state.values[index] ? value : this.state.values[index]}
                            onChange={event => this.handleChange(event, index)}
                            onKeyDown={event => this.handleKeyDown(event, index)}
                        />
                    )
                }
            </div>
        </div>;
    }
}
