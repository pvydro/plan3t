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
    _sensorRectWithPosition: Rect
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
        this._sensorRectWithPosition = this.sensorRect
        this.groundRects = GameMap.getInstance().collidableRects
    }

    update() {
        for (var i in this.groundRects) {
            const rect = this.groundRects[i]
            const target = this.groundPather.target
            const direction = this.groundPather.target.direction

            if (rect.middleY < target.bottomY) {
                if (target.middleX - this.sensorRect.halfWidth < rect.right
                // && target.middleX - this.sensorRect.halfWidth
                && target.leftX > rect.left
                && direction === Direction.Left) {  // Approaching from left
                    this.jump()
                } else if (target.middleX + this.sensorRect.halfWidth > rect.x
                && target.middleX + this.sensorRect.halfWidth < rect.right
                && direction === Direction.Right) {  // Approaching from right
                    this.jump()
                }
            }
        }
    }

    jump() {
        this.groundPather.jump()
    }

    get sensor() {
        return this.sensorRect
    }

    get sensorWithPosition() {
        const newX = this.groundPather.target.middleX - this.sensorRect.halfWidth
        const newY = this.groundPather.target.y

        if (newX !== this._sensorRectWithPosition.x || newY !== this._sensorRectWithPosition.y) {
            this._sensorRectWithPosition.x = newX
            this._sensorRectWithPosition.y = newY
        }

        return this._sensorRectWithPosition
    }
}
