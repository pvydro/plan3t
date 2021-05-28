import { IDimension } from '../engine/math/Dimension'
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

/**
 * Creates an array of parameters, excluding objects that are undefined or null
 * 
 * @param objects Children of new array
 * @returns Array of children
 */
export function trimArray(...objects: any): any[] {
    const arr: any[] = []

    for (var i in objects) {
        const child = objects[i]

        if (exists(child)) {
            arr.push(child)
        }
    }
    
    return arr
}

export function rect(x: number, y: number, width: number, height: number): IRect {
    return { x, y, width, height }
}

export function dimension(width: number, height: number): IDimension {
    return { width, height }
}

export function double(value: number): number {
    return value * 2
}
 
export function asyncTimeout(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}

export function isArray(obj: any) {
    return Array.isArray(obj)
}

export class Utils {

}
