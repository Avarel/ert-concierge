export interface SystemData {
    gravityConstant: number,
    scale: number,
    timeScale: number,
    bodyScale: number,
    centralBodyScale: number,
    elasticity: number,
    bodyCount: number,
    centralBodyName: string,
    handMass: number,
    boundary: number
}

export interface SystemObject {
    name: string,
    mass: number,
    radius: number,
    locationX: number,
    locationY: number,
    locationZ: number,
    orbitRadius: number,
    orbitSpeed: number,
    directionX: number,
    directionY: number,
    directionZ: number
}

export interface SystemDump {
    systemData: SystemData,
    objects: SystemObject[]
}