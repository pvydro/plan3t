import * as PIXI from 'pixi.js'
import { IDemolishable } from '../../interface/IDemolishable'
import { exists } from '../../utils/Utils'
import { IRect, Rect } from '../math/Rect'

export interface IGraphix extends IDemolishable {
    halfWidth: number
    halfHeight: number
}

export interface GraphixOptions {
    geometry?: Geometry
    alpha?: number
}

export class Graphix extends PIXI.Graphics implements IGraphix {
    _boundingBox: Rect

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
    
    getBoundingBox() {
        if (!this._boundingBox) {
            this._boundingBox = new Rect({ x: this.x, y: this.y, width: this.width, height: this.height })
        }

        this._boundingBox.x = this.x
        this._boundingBox.y = this.y
        this._boundingBox.width = this.width
        this._boundingBox.height = this.height

        return this._boundingBox
    }


    demolish() {
        this.destroy()
    }

    get halfWidth() {
        return this.width / 2
    }

    get halfHeight() {
        return this.height / 2
    }
}

export class Geometry extends PIXI.GraphicsGeometry {
    constructor() {
        super()
    }
}
