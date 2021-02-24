import { Rect } from '../../engine/math/Rect'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { AI, AIOptions, IAI } from '../AI'
import { GroundPatherDebugger, IGroundPatherDebugger } from './GroundPatherDebugger'

export interface IGroundPatherAI extends IAI, IUpdatable {
    currentGroundRect: Rect
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

    initialize() {

    }

    update() {
        this.debugger.update()

        if (this._currentGroundRect !== this.gravityEntity.currentGroundRect) {
            this.currentGroundRect = this.gravityEntity.currentGroundRect
        }
    }

    findPointOnCurrentGround() {
        Flogger.log('GroundPatherAI', 'findPointOnCurrentGround')

        const maximumDistance = this.gravityEntity.x - this.currentGroundRect.x

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
}
