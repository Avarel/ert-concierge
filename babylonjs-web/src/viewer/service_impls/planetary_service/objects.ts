import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { SystemObject } from './payloads';
import { PlanetaryService } from './mod';

export class PlanetObject {
    data!: SystemObject;
    mesh: BABYLON.Mesh;
    trailMesh: BABYLON.TrailMesh;

    constructor(
        parent: PlanetaryService,
        readonly id: string, 
        private centroid: BABYLON.Vector3,
        radius: number,
        scene: BABYLON.Scene,
        color: BABYLON.Color3
    ) {
        this.mesh = BABYLON.MeshBuilder.CreateSphere("sphere " + this.id, { diameter: radius * 2 }, scene);
        this.mesh.position = centroid;

        const mat = new BABYLON.StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        this.mesh.material = mat;
        const originalMatColor = mat.emissiveColor;

        this.mesh.actionManager = new BABYLON.ActionManager(scene);

        this.trailMesh = new BABYLON.TrailMesh("planet trail " + this.id, this.mesh, scene, Math.min(0.02, radius), 1000, true);

        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            () => {
                mat.emissiveColor = BABYLON.Color3.Red();
                parent.planetHover = this.id;
                parent.renderInformation();
            }
        ));
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            () => {
                mat.emissiveColor = originalMatColor;
                if (parent.planetHover == this.id) {
                    parent.planetHover = undefined;
                    parent.renderInformation();
                }
            }
        ));
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
                if (parent.planetLock == this.id) {
                    parent.planetLock = undefined;
                } else {
                    parent.planetLock = this.id;
                }
                parent.renderInformation();
            }
        ));

        // this did not work as expected for some reason
        // the GUI was drawn but not properly on the screen
        
        // const label = new GUI.Rectangle("label for " + this.id);
        // label.background = "black"
        // label.height = "30px";
        // label.alpha = 0.5;
        // label.width = "100px";
        // label.cornerRadius = 20;
        // label.thickness = 1;
        // label.linkOffsetY = 30;
        // parent.view.advancedTexture.addControl(label); 
        // label.linkWithMesh(this.mesh);

        // const text1 = new GUI.TextBlock();
        // text1.text = this.id;
        // text1.color = "white";
        // label.addControl(text1);  
    }

    dispose() {
        this.mesh.actionManager?.dispose();
        this.trailMesh?.dispose();
        this.mesh.dispose();
    }

    setColor(color: Readonly<BABYLON.Color3>) {
        (this.mesh.material! as BABYLON.StandardMaterial).diffuseColor! = color;
    }

    moveTo(point: Readonly<BABYLON.Vector3>) {
        let translate = point.subtract(this.centroid);

        this.mesh.position.addInPlace(translate);
        this.centroid.set(point.x, point.y, point.z);
    }
}