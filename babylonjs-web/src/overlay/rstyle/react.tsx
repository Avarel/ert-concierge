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
        readonly tag?: string,
        readonly value: any
    }
    interface InputValueProps {
        readonly label: string,
        readonly inputs: ReadonlyArray<InputField>,
        readonly readOnly?: true,
        readonly onSubmit?: (tag: string, value: string) => void,
    }
    interface InputValueState {
        readonly values: ReadonlyArray<any>
    }
    export class InputValue extends React.Component<InputValueProps, InputValueState> {
        constructor(props: InputValueProps) {
            super(props);
            this.state = { values: props.inputs.map(_ => undefined) };
        }
    
        handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.setState((state, props) => {
                    const tag = props.inputs[index].tag;
                    if (tag) {
                        const originalValue = props.inputs[index].value;
                        const value = state.values[index];

                        if (value && value != originalValue) {
                            props.onSubmit?.(tag, value);
                            
                            let values = state.values.slice();
                            values[index] = undefined;
                            return { values }
                        }
                    }
                    return state;
                });
            };
        }
    
        handleChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
            let value: string | undefined = event.currentTarget.value;
            this.setState((state, props) => {
                const originalValue = props.inputs[index].value;
                if (value == originalValue) {
                    value = undefined;
                }
                let values = state.values.slice();
                values[index] = value;
                return { values }
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