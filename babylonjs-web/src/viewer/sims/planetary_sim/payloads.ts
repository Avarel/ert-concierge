
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
    location: [number, number, number],
    color: [number, number, number],
    orbitRadius: number,
    orbitSpeed: number,
    direction: [number, number, number]
}

export interface SystemDump {
    type: "SYSTEM_DUMP"
    systemData: SystemData,
    objects: SystemObject[]
}

export interface SystemClear {
    type: "SYSTEM_CLEAR"
}

export type PlanetaryPayload = SystemDump | SystemClear;