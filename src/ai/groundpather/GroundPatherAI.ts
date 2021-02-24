import { Direction } from '../../engine/math/Direction'
import { Rect } from '../../engine/math/Rect'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { AI, AIOptions, IAI } from '../AI'
import { GroundPatherDebugger, IGroundPatherDebugger } from './GroundPatherDebugger'

export interface IGroundPatherAI extends IAI, IUpdatable {
    currentGroundRect: Rect
    currentDistanceFromEdge: number
    findPointOnCurrentGround(): void
    findNewGround(): void
}

export enum GroundPatherState {
    Wandering,
    Idle,
    Following,
    Scared
}

export interface GroundPatherOptions extends AIOptions {

}

export class GroundPatherAI extends AI implements IGroundPatherAI {
    _currentGroundRect: Rect
    _currentMaximumDistanceToEdge: number = 0
    debugger: IGroundPatherDebugger

    constructor(options: GroundPatherOptions) {
        super(options)

        this.debugger = new GroundPatherDebugger({ groundPather: this })
    }

    update() {
        this.debugger.update()

        if (this._currentGroundRect !== this.gravityEntity.currentGroundRect) {
            this.currentGroundRect = this.gravityEntity.currentGroundRect
        }
    }

    findPointOnCurrentGround() {
        Flogger.log('GroundPatherAI', 'findPointOnCurrentGround')

        const direction = this.gravityEntity.direction

        console.log('direction', direction)
        const maximumDistance = (direction == Direction.Left)
            ? this.gravityEntity.x - this.currentGroundRect.x
            : this.currentGroundRightEdgeX - this.gravityEntity.x

        this._currentMaximumDistanceToEdge = maximumDistance
        // const newTargetX = Math.random() * maximumDistance
    }

    findNewGround() {
        Flogger.log('GroundPatherAI', 'findNewGround')
    }

    set currentGroundRect(value: Rect) {
        if (this._currentGroundRect !== value) {
            this._currentGroundRect = value

            this.findPointOnCurrentGround()
        }
    }

    get currentGroundRect() {
        return this._currentGroundRect
    }

    get currentGroundRightEdgeX() {
        return this._currentGroundRect.x + this.currentGroundRect.width
    }

    get currentDistanceFromEdge() {
        return this._currentMaximumDistanceToEdge
    }
}
