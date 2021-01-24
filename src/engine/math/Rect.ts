import * as PIXI from 'pixi.js'
import { IDimension } from './Dimension'
import { IVector2, Vector2 } from './Vector2'

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

    set position(value: IVector2) {
        this.x = value.x
        this.y = value.y
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
