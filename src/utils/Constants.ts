export const WindowSize = {
    width: window.innerWidth,
    height: window.innerHeight
}

export const WorldSize = {
    width: 2000,
    height: 2000
}

export const BasicLerp = (a: number, b: number, t: number) => (b - a) * t + a
export const GlobalScale = 5

export class Constants {
    private constructor() {
        
    }
}

export enum Events {
    PlayerWalkEnd = 'PlayerWalkEnd'
}
