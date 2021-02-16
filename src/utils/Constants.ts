import { IDimension } from '../engine/math/Dimension'

export const WindowSize: IDimension = {
    width: window.innerWidth,
    height: window.innerHeight
}

export const WorldSize: IDimension = {
    width: 2000,
    height: 2000
}

export const BasicLerp = (pointA: number, pointB: number, time: number) => {
    return (pointB - pointA) * time + pointA
}
export const GlobalScale: number = 1
export const ShowCollisionDebug: boolean = false
export const ShowCameraProjectionDebug: boolean = false
export const ShowPlayerSynchDebug: boolean = false

export class DebugConstants {
    static DisableFoliage: boolean = true//false
    static DisableDepthShadows: boolean = true//false
    static ShowPlayerMessengerLogs: boolean = false
}

export class Constants {
    private constructor() {}
}

export class GravityConstants {
    static DropAcceleration: number = 1//3.5

    private constructor() {}
}

export class Defaults {
    static BulletVelocity: number = 5
    static ShouldLightsJitter: boolean = false

    private constructor() {}
}

export class UIConstants {
    static HUDScale: number = 5
    static HUDPadding: number = 42
}

export enum Events {
    PlayerWalkBounce = 'PlayerWalkBounce'
}
