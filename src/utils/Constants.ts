import { IDimension } from '../engine/math/Dimension'

export class WindowSize {
    private static _width =  window.innerWidth
    private static _height = window.innerHeight * 0.8
    private static _topMargin = window.innerHeight * 0.1

    static get width() {
        return this._width
    }

    static get height() {
        return this._height
    }

    static get fullWindowHeight() {
        return window.innerHeight
    }

    static get fullWindowWidth() {
        return window.innerWidth
    }

    static get y() {
        return this._topMargin
    }

    static get topMarginHeight() {
        return this._topMargin
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
    static SuperSprint: boolean = false
    static DisableFoliage: boolean = false
    static DisableDepthShadows: boolean = false
    static ShowPlayerMessengerLogs: boolean = false
    static ShowCameraProjectionDebug: boolean = false
    static ShowPlayerSynchDebug: boolean = false
    static ShowCollisionDebug: boolean = false
    static ShowInteractiveContainerDebug: boolean = true
}

export class AIDebugConstants {
    static ShowCurrentNode: boolean = false
    static ShowCurrentGroundIndicator: boolean = false
    static ShowCurrentGroundRange: boolean = false
    static ShowGroundJumperSensors: boolean = false
    static ShowAIBadge: boolean = false
}

export class Constants {
    private constructor() {}
}

export class GravityConstants {
    static DropAcceleration: number = 1//3.5

    private constructor() {}
}
