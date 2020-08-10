import * as BABYLON from 'babylonjs';

export class PolygonObject {
    centroid: BABYLON.Vector3;
    mesh: BABYLON.Mesh;

    private constructor(centroid: BABYLON.Vector3, mesh: BABYLON.Mesh) {
        this.centroid = centroid;
        this.mesh = mesh;
    }

    static create(centroid: BABYLON.Vector3, points: BABYLON.Vector2[], scene: BABYLON.Scene, color: BABYLON.Color3, scale: number = 1): PolygonObject {
        const corners = points.map((v) => v.scaleInPlace(scale));
        const poly_tri = new BABYLON.PolygonMeshBuilder("polytri", corners, scene);
        const mesh = poly_tri.build(undefined, 50 * scale);
        mesh.position.y += 50 * scale;

        var mat = new BABYLON.StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new BABYLON.ActionManager(scene);

        return new PolygonObject(centroid.scaleInPlace(scale), mesh);
    }

    setColor(color: Readonly<BABYLON.Color3>) {
        (this.mesh.material! as BABYLON.StandardMaterial).diffuseColor! = color;
    }

    moveTo(point: Readonly<BABYLON.Vector3>) {
        const translate = point.subtract(this.centroid);

        this.mesh.position.addInPlace(translate);
        this.centroid.set(point.x, point.y, point.z);
    }

    dispose() {
        this.mesh.dispose();
    }
}
