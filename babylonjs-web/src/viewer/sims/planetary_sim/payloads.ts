
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

export interface SystemObjsDump {
    type: "SYSTEM_OBJS_DUMP"
    objects: SystemObject[]
}

export interface SystemDataDump {
    type: "SYSTEM_DATA_DUMP",
    data: SystemData
}

export interface SystemClear {
    type: "SYSTEM_CLEAR"
}

export interface FetchSystemData {
    type: "FETCH_SYSTEM_DATA"
}

export type PlanetaryPayload = SystemObjsDump | SystemDataDump | SystemClear | FetchSystemData;