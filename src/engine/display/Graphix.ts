import * as PIXI from 'pixi.js'
import { IDemolishable } from '../../interface/IDemolishable'
import { exists } from '../../utils/Utils'
import { IRect } from '../math/Rect'

export interface IGraphix extends IDemolishable {

}

export interface GraphixOptions {
    geometry?: Geometry
    alpha?: number
}

export class Graphix extends PIXI.Graphics implements IGraphix {
    constructor(options?: GraphixOptions | Geometry) {
        const op = options as GraphixOptions
        const geometry: Geometry = (options && options instanceof Geometry)
            ? options as Geometry
                : op ? op.geometry : null

        super(geometry)

        if (exists(op)) {
            if (exists(op.alpha)) {
                this.alpha = op.alpha
            }
        }
    }

    drawIRect(rect: IRect, end?: boolean) {
        const result = this.drawRect(rect.x, rect.y, rect.width, rect.height)

        if (end) {
            this.endFill()
        }

        return result
    }

    demolish() {
        this.destroy()
    }
}

export class Geometry extends PIXI.GraphicsGeometry {
    constructor() {
        super()
    }
}
