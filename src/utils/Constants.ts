import { IDimension } from '../engine/math/Dimension'

export class GameWindow {
    private static _marginPercent = 0.15//125
    private static _width =  window.innerWidth
    private static _height = window.innerHeight * (1.0 - (GameWindow._marginPercent * 2))
    private static _topMargin = window.innerHeight * GameWindow._marginPercent

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
    static ShowUIButtonDebug: boolean = false
}

export class AIDebugConstants {
    static ShowCurrentNode: boolean = true
    static ShowCurrentGroundIndicator: boolean = false
    static ShowCurrentGroundRange: boolean = false
    static ShowGroundJumperSensors: boolean = false
    static ShowAIBadge: boolean = true
}

export class Constants {
    private constructor() {}
}

export class GravityConstants {
    static DropAcceleration: number = 1//3.5

    private constructor() {}
}
