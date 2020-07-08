import * as GUI from 'babylonjs-gui';
import * as ConciergeAPI from "./concierge_api";
import { Renderer } from "./renderer";

const CHAT_GROUP = "chat";
const INIT_CHAT = "Click to chat.";

export class ChatHandler extends ConciergeAPI.ServiceEventHandler {
    readonly renderer: Renderer;
    readonly client: ConciergeAPI.Client;

    uiTexture?: GUI.AdvancedDynamicTexture;
    input?: GUI.InputText;
    output?: GUI.TextBlock;

    constructor(client: ConciergeAPI.Client, renderer: Renderer) {
        super(client, CHAT_GROUP);
        this.renderer = renderer;
        this.client = client;
    }

    private createUITexture() {
        if (this.uiTexture) {
            this.uiTexture.dispose();
        }

        let uiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.uiTexture = uiTexture;
    }

    onSubscribe() {
        this.createUITexture();

        let panel = new GUI.StackPanel();
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.fontFamily = "monospace";

        let scrollViewer = new GUI.ScrollViewer();
        scrollViewer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        scrollViewer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        scrollViewer.heightInPixels = 150;
        scrollViewer.width = 0.4;
        scrollViewer.thickness = 0;
        scrollViewer.background = "#080808";
        scrollViewer.thumbLength = 0.2;
        scrollViewer.barSize = 10;

        let output = new GUI.TextBlock();
        output.fontFamily = "monospace";
        output.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        output.resizeToFit = true;
        output.color = "white";
        output.textWrapping = GUI.TextWrapping.WordWrap;
        output.fontSizeInPixels = 14;
        this.output = output;
        scrollViewer.addControl(output);
        panel.addControl(scrollViewer);
    
        let input = new GUI.InputText();
        input.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        input.fontFamily = "monospace";
        input.width = 0.4;
        input.maxWidth = 0.4;
        input.heightInPixels = 40;
        input.fontSizeInPixels = 14;
        input.color = "white";
        input.text = INIT_CHAT;
        input.thickness = 0;
        input.background = "black";
        input.onPointerClickObservable.add((event) => {
            if (input.text == INIT_CHAT) {
                input.text = "";
            }
        })
        input.onKeyboardEventProcessedObservable.add((event) => {
            let key = event.code;
            if (key == "Enter") {
                this.onEnter();
            }
        });
        this.input = input;
        panel.addControl(this.input);

        this.uiTexture!.addControl(panel);
    }

    onEnter() {
        if (this.input == undefined) {
            console.warn("Chat input UI has not been created");
            return;
        }
        this.client.sendJSON({
            type: "MESSAGE",
            target: {
                type: "GROUP",
                group: CHAT_GROUP,
            },
            data: this.input.text
        });
        this.input.text = INIT_CHAT;
    }

    onRecvMessage(message: ConciergeAPI.Payloads.Message<any>) {
        if (message.origin!.group != CHAT_GROUP) {
            return;
        }
        if (this.output == undefined) {
            console.warn("Chat output UI has not been created");
            return;
        }
        if (this.output.text.length != 0) {
            this.output.text += "\nz";
        } 
        this.output.text += `${message.origin!.name}: ${message.data}`;
    }

    onUnsubscribe() {
        this.input?.dispose();
        this.output?.dispose();
        this.uiTexture?.dispose();
    }
}