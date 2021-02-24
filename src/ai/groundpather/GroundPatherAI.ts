import { Direction } from '../../engine/math/Direction'
import { Rect } from '../../engine/math/Rect'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { exists } from '../../utils/Utils'
import { AI, AINode, AIOptions, IAI } from '../AI'
import { GroundPatherDebugger, IGroundPatherDebugger } from './GroundPatherDebugger'

export interface IGroundPatherAI extends IAI, IUpdatable {
    currentGroundRect: Rect
    currentDistanceFromEdge: number
    currentNode: AINode
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
    _currentNode?: AINode = undefined
    _currentState: GroundPatherState = GroundPatherState.Wandering
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
        const currentGroundY = this.currentGroundRect.y
        const baseX = this.gravityEntity.x
        const maximumDistance = (direction == Direction.Left)
            ? this.gravityEntity.x - this.currentGroundRect.x
            : this.currentGroundRightEdgeX - this.gravityEntity.x
        const calculatedDistance = (Math.random() * maximumDistance) * direction

        this._currentMaximumDistanceToEdge = maximumDistance
        this.currentNode = {
            x: baseX + calculatedDistance,
            y: currentGroundY
        } 
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

    set currentNode(value: AINode) {
        if (exists(this._currentNode)) {
            this._currentNode.x = value.x
            this._currentNode.y = value.y
        } else {
            this._currentNode = value
        }
    }

    get currentNode() {
        return this._currentNode
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
