import React from "react";

interface WindowTab {
    readonly tag: string,
    readonly ref: React.RefObject<HTMLDivElement>
}

interface WindowComponentState {
    tabs: Map<string, WindowTab>
}
export class WindowComponent extends React.Component<{}, WindowComponentState> {
    addTab(tag: string) {
        let ref = React.createRef<HTMLDivElement>();
        this.setState(state => {
            let tabs = new Map(state.tabs);
            tabs.set(tag, { tag, ref });
            return { tabs };
        });
        return ref;
    }

    render() {
        return <React.Fragment>
            {Array.from(this.state.tabs.values(), tab => <div ref={tab.ref}></div>)}
        </React.Fragment>;
    }
}