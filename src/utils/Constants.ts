export const WindowSize = {
    width: window.innerWidth,
    height: window.innerHeight
}

export const WorldSize = {
    width: 2000,
    height: 2000
}

export const BasicLerp = (a: number, b: number, t: number) => (b - a) * t + a

export class Constants {
    private constructor() {
        
    }
}
