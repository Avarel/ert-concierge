import { createElement } from "./mod";

export abstract class AbstractBody<E extends Node = HTMLElement, C extends AbstractBody<any, any> = any> {
    children: C[] = [];

    abstract readonly type: string;

    constructor(parent: AbstractBody | undefined, public bodyElement: E) {
        this.bodyElement = bodyElement;
        parent?.bodyElement.appendChild(bodyElement);
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
    readonly type = "HTMLBODY";
    
    constructor(parent: AbstractBody, tag: K, classes: string[] = []) {
        super(parent, createElement(tag, classes));
    }
}

abstract class TabSection extends AbstractBody<HTMLDivElement, Box | Button | Entry | HTMLBody<keyof HTMLElementTagNameMap>> {
    constructor(parent: AbstractBody | undefined, body: HTMLDivElement) {
        super(parent, body)
    }

    addEntry(callback?: (entry: Entry) => void): Entry {
        return this.addChild(new Entry(this), callback);
    }

    addBox(callback?: (box: Box) => void): Box {
        return this.addChild(new Box(this), callback);
    }

    add<K extends keyof HTMLElementTagNameMap>(tag: K, string: string): HTMLBody<K> {
        let body = new HTMLBody(this, tag, []);
        body.bodyElement.textContent = string;
        return this.addChild(body);
    }

    addButton(string: string, callback?: (button: Button) => void): Button {
        return this.addChild(new Button(this, string, callback));
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

export class Box extends TabSection {
    readonly type = "BOX";

    constructor(parent: AbstractBody) {
        super(parent, createElement("div", ["window-tab-box"]));
    }
}

export class Button extends AbstractBody<HTMLButtonElement, never> {
    readonly type = "BUTTON"

    constructor(parent: AbstractBody, string: string, public callback?: (button: Button) => void) {
        super(parent, createElement("button", []));
        this.bodyElement.textContent = string;
        this.bodyElement.onclick = () => {
            this.callback?.(this);
        }
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

    set text(new_name: string | null) {
        this.bodyElement.textContent = new_name
    }

    get text(): string | null {
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

    constructor(parent: AbstractBody, type: string, public callback?: (value: string, input: Input) => void) {
        super(parent, createElement("input"));
        this.bodyElement.setAttribute("type", type);
        this.type = type;
        this.bodyElement.onkeydown = (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.callback?.(this.value, this);
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
