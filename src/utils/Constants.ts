import { IDimension } from '../engine/math/Dimension'

export class WindowSize {
    static get width() {
        return window.innerWidth
    }

    static get height() {
        return window.innerHeight
    }
}

export const WorldSize: IDimension = {
    width: 2000,
    height: 2000
}

export const BasicLerp = (pointA: number, pointB: number, time: number) => {
    return (pointB - pointA) * time + pointA
}
export const GlobalScale: number = 1

export class DebugConstants {
    static SuperSprint: boolean = true
    static DisableFoliage: boolean = false
    static DisableDepthShadows: boolean = false
    static ShowPlayerMessengerLogs: boolean = false
    static ShowCameraProjectionDebug: boolean = false
    static ShowPlayerSynchDebug: boolean = false
    static ShowCollisionDebug: boolean = false
    static ShowInteractiveContainerDebug: boolean = true
}

export class AIDebugConstants {
    static ShowCurrentNode: boolean = true
    static ShowCurrentGroundIndicator: boolean = false
    static ShowCurrentGroundRange: boolean = false
    static ShowGroundJumperSensors: boolean = true
    static ShowAIBadge: boolean = false
}

export class Constants {
    private constructor() {}
}

export class GravityConstants {
    static DropAcceleration: number = 1//3.5

    private constructor() {}
}
