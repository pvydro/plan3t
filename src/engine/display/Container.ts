import * as PIXI from 'pixi.js'

export interface IContainer {
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
}
