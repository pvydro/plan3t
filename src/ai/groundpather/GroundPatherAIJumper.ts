import { Direction } from '../../engine/math/Direction'
import { IRect, Rect } from '../../engine/math/Rect'
import { GameMap } from '../../gamemap/GameMap'
import { IUpdatable } from '../../interface/IUpdatable'
import { IGroundPatherAI } from './GroundPatherAI'

export interface IGroundPatherAIJumper extends IUpdatable {
    sensor: IRect
}

export interface GroundPatherAIJumperOptions {
    groundPather: IGroundPatherAI
}

export class GroundPatherAIJumper implements IGroundPatherAIJumper {
    groundPather: IGroundPatherAI
    sensorRect: Rect
    sensorPadding: number = 8
    groundRects: Rect[]

    constructor(options: GroundPatherAIJumperOptions) {
        this.groundPather = options.groundPather
        
        const x = 0 + this.groundPather.target.halfWidth - (this.sensorPadding / 2)
        const width = (this.groundPather.target.width + (this.sensorPadding * 2))
        const height = this.groundPather.target.halfHeight

        this.sensorRect = new Rect({
            x, y: 0,
            width, height
        })
        this.groundRects = GameMap.getInstance().collidableRects
    }

    update() {
        for (var i in this.groundRects) {
            const rect = this.groundRects[i]
            const boundingBox = this.groundPather.target.boundsWithPosition
            const middleY = this.groundPather.target.middleY
            const middleX = this.groundPather.target.x
            const direction = this.groundPather.target.direction

            if (middleY < rect.y) {
                // console.log('bb intersects')
                if (Rect.intersects(boundingBox, rect)) {
                    if (rect.left < middleX && direction === Direction.Right
                    || rect.left > middleX && direction === Direction.Left) {
                        this.groundPather.jump()
                        // this.groundPather.target
                        // if (rect.left > boundingBox.left) {
    
                        // }
                        // Check if rectmidx < this.midx
                        // Jump left if so
                        // Else jump right
                    }
                    // Check if intersects
                    // Check if right side empty
                    // Else if left side empty
                    // Jump and go in that dir
                }
            }
        }
    }

    get sensor() {
        return this.sensorRect
    }
}
