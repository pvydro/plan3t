import { Container, IContainer } from '../display/Container'
import { IRect, Rect } from '../math/Rect'
import { Graphix } from '../display/Graphix'
import { IDemolishable } from '../../interface/IDemolishable'
import { Flogger } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'

export interface ICollisionDebugger extends IContainer, IDemolishable {
    initializeAndShowGraphics(): void
    createDebugGraphics(rectangles: IRect[]): Graphix
}

export interface CollisionDebuggerOptions {
    collisionRects?: IRect[]
    color?: number
    lineWidth?: number
}

export class CollisionDebugger extends Container implements ICollisionDebugger {
    collisionRects?: IRect[]
    color: number = 0x60b5b2
    lineWidth: number = 1
    
    constructor(options?: CollisionDebuggerOptions) {
        super()

        if (options) {
            this.color = options.color ?? this.color
            this.lineWidth = options.lineWidth ?? this.lineWidth
            this.collisionRects = options.collisionRects ?? undefined
        }

        if (DebugConstants.ShowCollisionDebug) {
            this.initializeAndShowGraphics()
        }
    }

    initializeAndShowGraphics() {
        const graphics = this.createDebugGraphics(this.collisionRects)

        this.addChild(graphics)
    }

    createDebugGraphics(rectangles?: IRect[]): Graphix {
        rectangles = rectangles ? rectangles : this.collisionRects

        Flogger.log('CollisionDebugger', 'createDebugGraphics')

        const rectangleGraphics = new Graphix()

        rectangleGraphics.lineStyle(this.lineWidth, this.color)

        if (rectangles !== undefined) {
            rectangles.forEach((rect: IRect) => {
                rectangleGraphics.drawIRect(rect)
            })
        }

        return rectangleGraphics  
    }

    demolish() {

    }
}
