import * as BABYLON from 'babylonjs';
import { SystemObject } from './payloads';
import { PlanetaryService } from './mod';

export class PlanetObject {
    private enterAction?: BABYLON.IAction;
    private exitAction?: BABYLON.IAction;
    private clickAction?: BABYLON.IAction;
    data!: SystemObject;

    private constructor(
        public readonly id: string,
        private centroid: BABYLON.Vector3,
        public mesh: BABYLON.Mesh,
        public trailMesh?: BABYLON.TrailMesh
    ) { }

    static create(id: string, centroid: BABYLON.Vector3, radius: number, scene: BABYLON.Scene, color: BABYLON.Color3, scale: number = 1): PlanetObject {
        let mesh = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: radius * 2 * scale }, scene);
        mesh.position = centroid;

        var mat = new BABYLON.StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new BABYLON.ActionManager(scene);

        let trailMesh = new BABYLON.TrailMesh("trail", mesh, scene, Math.min(0.02, radius * scale), 1000, true);

        return new PlanetObject(id, centroid, mesh, trailMesh);
    }

    dispose() {
        this.unhookHover();
        this.trailMesh?.dispose();
        this.mesh.dispose();
    }

    hookHover(handler: PlanetaryService) {
        if (this.mesh.actionManager) {
            this.enterAction = new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    handler.hoveredPlanets.add(this.id);
                    handler.renderInformation();
                }
            );
            this.exitAction = new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    handler.hoveredPlanets.delete(this.id);
                    handler.renderInformation();
                }
            );
            this.clickAction = new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    if (handler.planetLock == this.id) {
                        handler.planetLock = undefined;
                    } else {
                        handler.planetLock = this.id;
                    }
                    handler.renderInformation();
                }
            );
            this.mesh.actionManager.registerAction(this.enterAction);
            this.mesh.actionManager.registerAction(this.exitAction);
            this.mesh.actionManager.registerAction(this.clickAction);
        }
    }

    unlit() {
        (this.mesh.material as BABYLON.StandardMaterial).emissiveColor = BABYLON.Color3.Black();

    }

    lit() {
        (this.mesh.material as BABYLON.StandardMaterial).emissiveColor = BABYLON.Color3.Red();
    }

    unhookHover() {
        if (this.mesh.actionManager) {
            if (this.enterAction) {
                this.mesh.actionManager.unregisterAction(this.enterAction);
                this.enterAction = undefined;
            }
            if (this.exitAction) {
                this.mesh.actionManager.unregisterAction(this.exitAction);
                this.exitAction = undefined;
            }
            if (this.clickAction) {
                this.mesh.actionManager.unregisterAction(this.clickAction);
                this.clickAction = undefined;
            }
        }
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