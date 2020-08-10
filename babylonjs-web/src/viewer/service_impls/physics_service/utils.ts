import * as BABYLON from 'babylonjs';

import { Vec2f, RgbColor } from "./payloads";

export function vec2f2vector2(vec: Readonly<Vec2f>): BABYLON.Vector2 {
    return new BABYLON.Vector2(vec.x - 500, vec.y - 500);
}

export function tuple2color3(tuple: Readonly<RgbColor>): BABYLON.Color3 {
    function clamp(n: number): number {
        return Math.max(0, Math.min(n, 255)) / 255
    }

    return new BABYLON.Color3(clamp(tuple[0]), clamp(tuple[1]), clamp(tuple[2]))
}
