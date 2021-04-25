import { IRect } from '../engine/math/Rect'

export function exists(item): boolean {
    let doesExist = true
    
    if (item === null || item === undefined) {
        doesExist = false
    }

    return doesExist
}

export function functionExists(item): boolean {
    let doesExist = true

    if (!exists(item) || typeof item !== 'function') {
        doesExist = false
    }

    return doesExist
}

export function rect(x: number, y: number, width: number, height: number): IRect {
    return { x, y, width, height }
}

export function timeoutToPromise(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}
export class Utils {

}
