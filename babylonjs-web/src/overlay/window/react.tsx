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

interface EntryProps {
    name: string,
    values: { tag?: string, value: any }[],
    readOnly?: true,
    onSubmit?: (tag: string, value: string) => void,
}
interface EntryState {
    values: any[]
}
export class Entry extends React.Component<EntryProps, EntryState> {
    constructor(props: EntryProps) {
        super(props);
        this.state = { values: props.values.map(v => undefined) };
    }

    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (event.keyCode === 13) {
            event.preventDefault();
            const tag = this.props.values[index].tag;
            if (!tag) return;
            const originalValue = this.props.values[index].value;
            const value = this.state.values[index];
            if (value && value != originalValue) {
                this.props.onSubmit?.(tag, value);
            }
        }
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value = event.currentTarget.value;
        const originalValue = this.props.values[index].value;
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
                    this.props.values.map(({ tag, value }, index) =>
                        <input
                            readOnly={tag == undefined}
                            value={!this.state.values[index] ? value : this.state.values[index]}
                            onChange={event => this.handleChange(event, index)}
                            onKeyDown={event => this.onKeyDown(event, index)}
                        />
                    )
                }
            </div>
        </div>;
    }
}
