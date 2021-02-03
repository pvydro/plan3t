export const WindowSize = {
    width: window.innerWidth,
    height: window.innerHeight
}

export const WorldSize = {
    width: 2000,
    height: 2000
}

export const BasicLerp = (pointA: number, pointB: number, time: number) => {
    return (pointB - pointA) * time + pointA
}
export const GlobalScale = 1//5
export const ShowCollisionDebug = false
export const ShowCameraProjectionDebug = false

export class DebugConstants {
    static DisableFoliage: boolean = false
    static DisableDepthShadows: boolean = false
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
