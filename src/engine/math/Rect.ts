import * as PIXI from 'pixi.js'
import { IDimension } from './Dimension'
import { IVector2, Vector2 } from './Vector2'

export interface IRect {
    x: number
    y: number
    width: number
    height: number
}

export interface RectOptions {
    x: number
    y: number
    width: number
    height: number
}

export class Rect extends PIXI.Rectangle implements IRect {
    constructor(options: RectOptions) {
        super(
            options.x,
            options.y,
            options.width,
            options.height
        )
    }

    intersects(rectB: Rect) {
        return Rect.intersects(this, rectB)
    }

    get middleX() {
        return this.left + this.halfWidth
    }

    get middleY() {
        return this.y + this.halfHeight
    }

    static intersects(rectA: Rect, rectB: Rect) {
        let intersecting = false

        // x
        if (rectB.left > rectA.left && rectB.left < rectA.right
        || rectB.right < rectA.right && rectB.right > rectA.right) {
            if (rectB.top > rectA.top && rectB.top < rectA.bottom
            || rectB.bottom < rectA.bottom && rectB.bottom > rectA.top) {
            // y
                intersecting = true
            }
        }

        return intersecting
    }

    static get Zero() {
        return new Rect({
            x: 0,
            y: 0,
            width: 0,
            height: 0
        })
    }

    set position(value: IVector2) {
        this.x = value.x
        this.y = value.y
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }

    get halfHeight() {
        return this.height / 2
    }

    get halfWidth() {
        return this.width / 2
    }
}
