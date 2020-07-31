import { createElement } from "./mod";

export abstract class AbstractBody<E extends Node = HTMLElement, C extends AbstractBody<any, any> = any> {
    bodyElement: E;
    children: C[] = [];

    constructor(parent: AbstractBody | undefined, body: E) {
        this.bodyElement = body;
        parent?.bodyElement.appendChild(body);
    }

    protected addChild<T extends C>(child: T, callback?: (child: T) => void): T {
        this.children.push(child);
        callback?.(child);
        return child;
    }

    remove() {
        for (const child of this.children) {
            child.remove()
        }
    }
}

export class HTMLBody<K extends keyof HTMLElementTagNameMap> extends AbstractBody<HTMLElementTagNameMap[K], never> {
    constructor(parent: AbstractBody, tag: K, classes: string[] = []) {
        super(parent, createElement(tag, classes));
    }
}

abstract class TabSection extends AbstractBody<HTMLDivElement, Box | HTMLBody<keyof HTMLElementTagNameMap>> {
    constructor(parent: AbstractBody | undefined, body: HTMLDivElement) {
        super(parent, body)
    }

    addBox(callback?: (box: Box) => void): Box {
        return this.addChild(new Box(this), callback);
    }

    addH1(string: string) {
        this.addChild(new HTMLBody(this, "h1", [])).bodyElement.textContent = string;
    }

    addP(string: string) {
        this.addChild(new HTMLBody(this, "p", [])).bodyElement.textContent = string;
    }
}

export class Header extends TabSection {
    readonly type = "HEADER";

    constructor(parent: AbstractBody) {
        super(parent, createElement("div", ["window-tab-header"]));
    }
}

export class Body extends TabSection {
    readonly type = "BODY";

    constructor(parent: AbstractBody) {
        super(parent, createElement("div", ["window-tab-body"]));
    }
}

export class Box extends AbstractBody<HTMLDivElement, Entry | HTMLBody<keyof HTMLElementTagNameMap>> {
    readonly type = "BOX";

    constructor(parent: AbstractBody) {
        super(parent, createElement("div", ["window-tab-box"]));
    }

    addEntry(callback?: (entry: Entry) => void): Entry {
        return this.addChild(new Entry(this), callback);
    }

    addH1(string: string) {
        this.addChild(new HTMLBody(this, "h1", [])).bodyElement.textContent = string;
    }

    addP(string: string) {
        this.addChild(new HTMLBody(this, "p", [])).bodyElement.textContent = string;
    }
}

export class Entry extends AbstractBody<HTMLDivElement, Name | Value> {
    readonly type = "ENTRY";

    constructor(parent: AbstractBody) {
        super(parent, createElement("div", ["entry"]));
        this.addChild(new Name(this));
        this.addChild(new Value(this));
    }

    get name(): Name {
        return this.children[0] as Name;
    }

    get value(): Value {
        return this.children[1] as Value;
    }
}

export class Name extends AbstractBody<HTMLDivElement, never> {
    readonly type = "ENTRY_NAME";

    constructor(parent: AbstractBody) {
        super(parent, createElement("div", ["name"]));
    }

    set value(new_name: string | null) {
        this.bodyElement.textContent = new_name
    }

    get value(): string | null {
        return this.bodyElement.textContent
    }
}

export class Value extends AbstractBody<HTMLDivElement, Input> {
    readonly type = "ENTRY_VALUE";

    constructor(parent: AbstractBody) {
        super(parent, createElement("div", ["value"]));
    }

    addTextInput(callback: (value: string, input: Input) => void): Input {
        return this.addChild(new Input(this, "text", callback));
    }
}

export class Input extends AbstractBody<HTMLInputElement> {
    type: string;
    callback?: (value: string, input: Input) => void;

    constructor(parent: AbstractBody, type: string, callback?: (value: string, input: Input) => void) {
        super(parent, createElement("input"));
        this.bodyElement.setAttribute("type", type);
        this.type = type;
        let callbackWrapper = () => this.callback?.(this.value, this);
        this.bodyElement.onblur = callbackWrapper;
        this.bodyElement.onkeydown = (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                callbackWrapper();
            }
        };
    }

    set value(str: string) {
        this.bodyElement.value = str
    }

    get value(): string {
        return this.bodyElement.value
    }
}
