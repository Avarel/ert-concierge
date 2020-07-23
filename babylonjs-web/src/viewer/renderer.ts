import * as BABYLON from 'babylonjs';
import { Vector3 } from 'babylonjs';

export class Renderer {
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    scene?: BABYLON.Scene;
    shadowGenerator?: BABYLON.ShadowGenerator;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true);
    }

    createScene() {
        if (this.scene) {
            this.scene.dispose();
        }

        let scene = new BABYLON.Scene(this.engine);
        let camera = new BABYLON.UniversalCamera("UniversalCamera", new Vector3(0, 10, -10), scene);
        camera.setTarget(new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);
        camera.speed = 0.5;
        camera.keysDownward.push(17); //CTRL
        camera.keysUpward.push(32); //SPACE
        camera.keysUp.push(87);    //W
        camera.keysDown.push(83)   //D
        camera.keysLeft.push(65);  //A
        camera.keysRight.push(68); //S

        let light = new BABYLON.PointLight("light1", new BABYLON.Vector3(0, 500, 0), scene);
        light.intensity = 1.0;

        let helper = scene.createDefaultEnvironment({
            skyboxSize: 50,
            groundSize: 50,
            groundShadowLevel: 0.5,
            enableGroundShadow: true
        });
        helper!.skybox!.isPickable = false;
        helper!.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"));

        // this.shadowGenerator = new BABYLON.ShadowGenerator(512, light);

        var vrHelper = scene.createDefaultVRExperience({ createDeviceOrientationCamera: false });
        vrHelper.enableTeleportation({ floorMeshes: [helper!.ground!] });

        this.scene = scene;
    }

    start() {
        if (this.scene == undefined) {
            this.createScene();
        }

        let renderFunc = () => {
            if (this.scene) {
                this.scene.render()
            } else {
                this.engine.stopRenderLoop(renderFunc)
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