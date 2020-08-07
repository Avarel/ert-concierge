
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

export interface SystemRemovePlanets {
    type: "SYSTEM_REMOVE_PLANETS",
    ids: string[]
}

export interface SystemClear {
    type: "SYSTEM_CLEAR"
}

export interface FetchSystemData {
    type: "FETCH_SYSTEM_DATA"
}

export interface FetchSystemObjs {
    type: "FETCH_SYSTEM_OBJS"
}

export interface Play {
    type: "PLAY"
}

export interface Pause {
    type: "PAUSE"
}

export interface FastForward {
    type: "FAST_FORWARD"
}

export interface StepForward {
    type: "STEP_FORWARD"
}

export interface FastBackward {
    type: "FAST_BACKWARD"
}

export interface LoadSystem {
    type: "LOAD_SYSTEM",
    url: string
}

export interface UpdateData {
    type: "UPDATE_DATA",
    target: string,
    field: string,
    value: any
}

export type PlanetaryPayload = SystemObjsDump | SystemDataDump | SystemClear | SystemRemovePlanets
    | FetchSystemData | FetchSystemObjs | Play | Pause | FastForward 
    | StepForward | FastBackward | LoadSystem | UpdateData;