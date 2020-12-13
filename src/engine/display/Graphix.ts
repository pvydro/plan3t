import * as PIXI from 'pixi.js'
import { Rect } from '../math/Rect'

export interface IGraphix {

}

export class Graphix extends PIXI.Graphics implements IGraphix {
    constructor(geometry?: Geometry) {
        super(geometry)
    }

    drawIRect(rect: Rect) {
        return this.drawRect(rect.x, rect.y, rect.width, rect.height)
    }
}

export class Geometry extends PIXI.GraphicsGeometry {
    constructor() {
        super()
    }
}
