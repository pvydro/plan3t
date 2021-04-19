import * as PIXI from 'pixi.js'
import { IDemolishable } from '../../interface/IDemolishable'
import { IDimension } from '../math/Dimension'

export interface IContainer extends IDemolishable {
    name: string 
    accessible: boolean
    accessibleChildren: boolean
    alpha: number
    angle: number
    buttonMode: boolean
    cacheAsBitmap: boolean
    rotation: number
    x: number
    y: number
    width: number
    height: number
    clearChildren(): void
}

export class Container extends PIXI.Container implements IContainer {
    constructor() {
        super()
    }

    clearChildren() {
        this.children.forEach((child) => {
            this.removeChild(child)
            child.destroy()
        })
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }


    get halfWidth() {
        return this.width / 2
    }

    get halfHeight() {
        return this.height / 2
    }

    demolish(): void {

    }
}
