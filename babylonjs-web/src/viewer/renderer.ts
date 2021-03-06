import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

export class RendererView {
    isFocused: boolean = false;

    private camera?: BABYLON.Camera;
    // advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui-planetary");

    constructor(
        readonly renderer: Renderer,
        readonly canvas: HTMLCanvasElement,
        readonly scene: BABYLON.Scene
    ) {
        canvas.addEventListener("click", () => {
            if (this.isFocused) {
                return;
            }
            this.attachControl();
            this.isFocused = true;
        });
        canvas.addEventListener("blur", () => {
            this.detachControl();
            this.isFocused = false;
        });
    }

    universalCamera() {
        console.log("View: Using universal camera.");
        let camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 15, -15), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        camera.speed = 0.5;                 // KEYS:
        camera.keysDownward.push(17, 16);   // CTRL, SHIFT  (as of time of writing, this is only available on preview babylon)
        camera.keysUpward.push(32);         // SPACE        (as of time of writing, this is only available on preview babylon)
        camera.keysUp.push(87, 38);         // W, UP
        camera.keysDown.push(83, 40)        // D, DOWN
        camera.keysLeft.push(65, 37);       // A, LEFT
        camera.keysRight.push(68, 39);      // S, RIGHT
        this.setCamera(camera);
    }

    arcRotateCamera() {
        console.log("View: Using arc roatate camera.");
        let camera = new BABYLON.ArcRotateCamera("ArcCamera", Math.PI, Math.PI, 15, BABYLON.Vector3.Zero(), this.scene);
        camera.setPosition(new BABYLON.Vector3(0, 5, 15));
        camera.speed = 0.25;                // KEYS:
        camera.keysUp.push(87, 38);         // W, UP
        camera.keysDown.push(83, 40)        // D, DOWN
        camera.keysLeft.push(65, 37);       // A, LEFT
        camera.keysRight.push(68, 39);      // S, RIGHT
        this.setCamera(camera);
    }

    setCamera(camera: BABYLON.Camera) {
        if (this.camera) {
            this.scene.removeCamera(this.camera);
            this.camera.dispose();
        }
        this.detachControl();
        this.camera = camera;
        this.scene.addCamera(camera);
        this.scene.activeCamera = camera;
        this.renderer.engine.registerView(this.canvas, camera);
        this.attachControl();
    }

    attachControl() {
        console.log("View: Attaching controls.")
        this.renderer.engine.inputElement = this.canvas;
        this.scene.attachControl(true, true, true);
        if (this.camera) {
            this.camera.attachControl(this.canvas, false);
        }
    }

    detachControl() {
        console.log("View: Detaching controls.")
        this.scene.detachControl();
        if (this.camera) {
            this.camera.detachControl(this.canvas);
        }
    }
}

export class Renderer {
    engine: BABYLON.Engine;
    views: RendererView[] = [];

    constructor() {
        let canvas = document.createElement("canvas");
        this.engine = new BABYLON.Engine(canvas, true);
    }

    createView(canvas: HTMLCanvasElement): RendererView {
        let scene = new BABYLON.Scene(this.engine);

        let light = new BABYLON.PointLight("light1", new BABYLON.Vector3(0, 500, 0), scene);
        light.intensity = 1.0;

        let helper = scene.createDefaultEnvironment({
            skyboxSize: 500,
            groundSize: 500,
            groundShadowLevel: 0.5,
            enableGroundShadow: true
        });
        helper!.skybox!.isPickable = false;
        helper!.setMainColor(BABYLON.Color3.FromHexString("#909090"));

        let view = new RendererView(this, canvas, scene);
        this.views.push(view);
        return view;
    }

    start() {
        let renderFunc = () => {
            for (const view of this.views) {
                if (this.engine.activeView?.target === view.canvas) {
                    view.scene.render()
                }
            }
        };
        this.engine.runRenderLoop(renderFunc);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    stop() {
        this.engine.stopRenderLoop();
    }
}