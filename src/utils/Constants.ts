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
export const GlobalScale = 5
export const ShowCollisionDebug = false

export class Constants {
    private constructor() {}
}

export class GravityConstants {
    public static DropAcceleration: number = 3.5

    private constructor() {}
}

export class Defaults {
    public static BulletVelocity = 10

    private constructor() {}
}

export enum Events {
    PlayerWalkBounce = 'PlayerWalkBounce'
}
