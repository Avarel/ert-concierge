export interface SystemData {
    readonly gravityConstant: number,
    readonly scale: number,
    readonly timeScale: number,
    readonly bodyScale: number,
    readonly centralBodyScale: number,
    readonly elasticity: number,
    readonly bodyCount: number,
    readonly centralBodyName: string,
    readonly handMass: number,
    readonly boundary: number
}

export interface SystemObject {
    readonly name: string,
    readonly mass: number,
    readonly radius: number,
    readonly location: [number, number, number],
    readonly color: [number, number, number],
    readonly orbitRadius: number,
    readonly orbitSpeed: number,
    readonly direction: [number, number, number]
}

export interface SystemObjsDump {
    readonly type: "SYSTEM_OBJS_DUMP"
    readonly objects: ReadonlyArray<SystemObject>
}

export interface SystemDataDump {
    readonly type: "SYSTEM_DATA_DUMP",
    readonly data: Readonly<SystemData>
}

export interface SystemRemovePlanets {
    readonly type: "SYSTEM_REMOVE_PLANETS",
    readonly ids: ReadonlyArray<string>
}

export interface SystemClear {
    readonly type: "SYSTEM_CLEAR"
}

export interface FetchSystemData {
    readonly type: "FETCH_SYSTEM_DATA"
}

export interface FetchSystemObjs {
    readonly type: "FETCH_SYSTEM_OBJS"
}

export interface Play {
    readonly type: "PLAY"
}

export interface Pause {
    readonly type: "PAUSE"
}

export interface FastForward {
    readonly type: "FAST_FORWARD"
}

export interface StepForward {
    readonly type: "STEP_FORWARD"
}

export interface FastBackward {
    readonly type: "FAST_BACKWARD"
}

export interface LoadSystem {
    readonly type: "LOAD_SYSTEM",
    readonly url: string
}

export interface UpdateData {
    readonly type: "UPDATE_DATA",
    readonly target: string,
    readonly field: string,
    readonly value: any
}

export type PlanetaryPayload = SystemObjsDump | SystemDataDump | SystemClear | SystemRemovePlanets
    | FetchSystemData | FetchSystemObjs | Play | Pause | FastForward 
    | StepForward | FastBackward | LoadSystem | UpdateData;