export enum Direction {
    Left = -1,
    Right = 1
}

export enum FourWayDirection {
    Left = 'Left',
    Right = 'Right',
    Up = 'Up',
    Down = 'Down',
}

export namespace FourWayDirection {
    export function isHorizontal(direction: FourWayDirection) {
        return direction == FourWayDirection.Left || direction == FourWayDirection.Right
    }

    export function isVertical(direction: FourWayDirection) {
        return direction == FourWayDirection.Down || direction == FourWayDirection.Up
    }
}
