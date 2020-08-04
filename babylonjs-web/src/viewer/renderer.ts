import * as BABYLON from 'babylonjs';
import { Vector3 } from 'babylonjs';

export class RendererView {
    isFocused: boolean = false;

    constructor(
        readonly renderer: Renderer,
        readonly canvas: HTMLCanvasElement,
        readonly scene: BABYLON.Scene,
        readonly camera: BABYLON.Camera
    ) {
        renderer.engine.registerView(canvas, camera);
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

        if (this.renderer.engine.inputElement == null) {
            canvas.click();
        }
    }

    attachControl() {
        console.log("Attach")
        this.renderer.engine.inputElement = this.canvas;
        this.camera.attachControl(this.canvas, true);
        this.scene.attachControl(true, true, true);
    }

    detachControl() {
        console.log("Detach")
        this.scene.detachControl();
    }
}

export class Renderer {
    engine: BABYLON.Engine;
    views: RendererView[] = [];

    constructor() {
        let canvas = document.createElement("canvas");
        let gl = canvas.getContext("webgl");
        this.engine = new BABYLON.Engine(gl, true);
    }

    createView(canvas: HTMLCanvasElement): RendererView {
        let scene = new BABYLON.Scene(this.engine);
        let camera = new BABYLON.UniversalCamera("UniversalCamera", new Vector3(0, 15, -15), scene);
        camera.setTarget(new Vector3(0, 0, 0));
        camera.speed = 0.5;                 // KEYS:
        camera.keysDownward.push(17, 16);   // CTRL, SHIFT
        camera.keysUpward.push(32);         // SPACE
        camera.keysUp.push(87, 38);         // W, UP
        camera.keysDown.push(83, 40)        // D, DOWN
        camera.keysLeft.push(65, 37);       // A, LEFT
        camera.keysRight.push(68, 39);      // S, RIGHT

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

        let view = new RendererView(this, canvas, scene, camera);
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