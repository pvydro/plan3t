import * as PIXI from 'pixi.js'
import { IDemolishable } from '../../interface/IDemolishable'

export interface IContainer extends IDemolishable {
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

    get halfWidth() {
        return this.width / 2
    }

    get halfHeight() {
        return this.height / 2
    }

    demolish(): void {

    }
}
