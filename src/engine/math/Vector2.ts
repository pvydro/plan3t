import * as PIXI from 'pixi.js'
import { BasicLerp } from '../../utils/Constants'

export interface IVector2 extends PIXI.IPoint {

}

export class Vector2 extends PIXI.Point implements IVector2 {
    constructor(x: number, y: number) {
        super(x ?? 0, y ?? 0)
    }

    /**
     * Returns a new Vector2 with default values 0, 0
     */
    static get Zero() {
        return new Vector2(0, 0)
    }

    /**
     * Returns a new Vector2 with default values 1, 1
     */
    static get One() {
        return new Vector2(1, 1)
    }

    lerp(toPoint: IVector2, speed: number) {
        this.x = BasicLerp(this.x, toPoint.x, speed)
        this.y = BasicLerp(this.y, toPoint.y, speed)
    }
}
