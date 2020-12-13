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

export class Constants {
    private constructor() {
        
    }
}

export enum Events {
    PlayerWalkBounce = 'PlayerWalkEnd'
}
