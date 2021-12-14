import { IVector2 } from '../engine/math/Vector2'
import { FourWayDirection } from '../engine/math/Direction'

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
    // return (1 - t) * a + t * b
}

export function getRandomFloatBetween(maximum: number, minimum: number = 0): number {
    return Math.random() * maximum + minimum
}

export function getRandomBool(): boolean {
    return Math.random() >= 0.5
}

export function getRandomIntBetween(minimum: number, maximum: number) {
    return Math.floor(Math.random() * maximum) + minimum
}

export function toRadians(degrees: number): number {
    return degrees * Math.PI / 180
}

export function getAnchorForDirection(direction: FourWayDirection): IVector2 {
    switch (direction) {
        case FourWayDirection.Left:
            return { x: 1, y: 0.5 }
        case FourWayDirection.Right:
            return { x: 0, y: 0.5 }
        case FourWayDirection.Up:
            return { x: 0, y: 1 }
        case FourWayDirection.Down:
            return { x: 0, y: 0 }
    }
}
