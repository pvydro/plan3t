import * as PIXI from 'pixi.js'

export interface IRect {

}

export class Rect extends PIXI.Rectangle implements IRect {
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height)
    }
}
