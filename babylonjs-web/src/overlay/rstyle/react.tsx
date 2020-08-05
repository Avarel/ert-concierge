import "./style.scss";

import React from "react";

/**
 * I had no idea what to name this style set so I named it Rs, after the
 * file extension for the Rust language.
 */
export module Rs {
    export class Row extends React.PureComponent<{light?: boolean} & React.HTMLAttributes<HTMLDivElement>> {
        render() {
            return <div className="rs-flex-row" {...this.props}>
                {this.props.children}
            </div>;
        }
    }
    
    export class Pad extends React.PureComponent<{light?: boolean} & React.HTMLAttributes<HTMLDivElement>> {
        render() {
            return <div className={`rs-pad${this.props.light ? " light" : ""}`} {...this.props}>
                {this.props.children}
            </div>;
        }
    }
    
    export class Card extends React.PureComponent<React.HTMLAttributes<HTMLDivElement>> {
        render() {
            return <div className="rs-card" {...this.props}>
                {this.props.children}
            </div>;
        }
    }
    
    interface InputField {
        tag?: string,
        value: any
    }
    interface InputValueProp {
        label: string,
        inputs: InputField[],
        readOnly?: true,
        onSubmit?: (tag: string, value: string) => void,
    }
    interface InputValueState {
        values: any[]
    }
    export class InputValue extends React.Component<InputValueProp, InputValueState> {
        constructor(props: InputValueProp) {
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
            return <div className="input-value">
                <div className="label">{this.props.label}</div>
                <div className="field">
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
}

export default Rs;