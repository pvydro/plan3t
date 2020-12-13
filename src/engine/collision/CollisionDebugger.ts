import { Container, IContainer } from '../display/Container'
import { IRect, Rect } from '../math/Rect'
import { Graphix } from '../display/Graphix'
import { IDemolishable } from '../../interface/IDemolishable'
import { LoggingService } from '../../service/LoggingService'

export interface ICollisionDebugger extends IContainer, IDemolishable {
    initializeAndShowGraphics(): void
    createDebugGraphics(rectangles: IRect[]): Graphix
}

export interface CollisionDebuggerOptions {
    collisionRectangles?: Rect[]
    color?: number
    lineWidth?: number
}

export class CollisionDebugger extends Container implements ICollisionDebugger {
    collisionRectangles?: Rect[]
    color: number = 0xFF0000
    lineWidth: number = 2
    
    constructor(options?: CollisionDebuggerOptions) {
        super()

        if (options) {
            this.color = options.color ?? this.color
            this.lineWidth = options.lineWidth ?? this.lineWidth
            this.collisionRectangles = options.collisionRectangles ?? undefined
        }
    }

    initializeAndShowGraphics() {
        const graphics = this.createDebugGraphics(this.collisionRectangles)

        this.addChild(graphics)
    }

    createDebugGraphics(rectangles?: Rect[]): Graphix {
        rectangles = rectangles ? rectangles : this.collisionRectangles

        LoggingService.log('CollisionDebugger', 'createDebugGraphics', 'rectangles', rectangles)

        const rectangleGraphics = new Graphix()

        rectangleGraphics.lineStyle(this.lineWidth, this.color)

        if (rectangles !== undefined) {
            rectangles.forEach((rect: Rect) => {
                rectangleGraphics.drawIRect(rect)
            })
        }

        return rectangleGraphics        
    }

    demolish() {

    }
}
