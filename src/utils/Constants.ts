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

export class Constants {
    private constructor() {}
}

export class GravityConstants {
    static DropAcceleration: number = 1//3.5

    private constructor() {}
}

export class Defaults {
    static BulletVelocity = 5
    static ShouldLightsJitter = false

    private constructor() {}
}

export class UIConstants {
    static HUDScale = 5
    static HUDPadding = 42
}

export enum Events {
    PlayerWalkBounce = 'PlayerWalkBounce'
}
