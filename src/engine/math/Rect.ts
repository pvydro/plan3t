import * as PIXI from 'pixi.js'

export interface IRect {
    x: number
    y: number
    width: number
    height: number
}

export class Rect extends PIXI.Rectangle implements IRect {
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height)
    }

    static get Zero() {
        return new Rect(0, 0, 0, 0)
    }
}
