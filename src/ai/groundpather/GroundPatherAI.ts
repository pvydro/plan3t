import { GravityOrganismState } from '../../cliententity/gravityorganism/GravityOrganism'
import { Direction } from '../../engine/math/Direction'
import { Rect } from '../../engine/math/Rect'
import { IUpdatable } from '../../interface/IUpdatable'
import { log } from '../../service/Flogger'
import { AI, AINode, AIOptions, IAI } from '../AI'
import { GroundPatherAIJumper, IGroundPatherAIJumper } from './GroundPatherAIJumper'
import { GroundPatherDebugger, IGroundPatherDebugger } from './GroundPatherDebugger'

export interface IGroundPatherAI extends IAI, IUpdatable {
    jumper: IGroundPatherAIJumper
    currentGroundRect: Rect
    currentDistanceFromEdge: number
    currentNode: AINode | undefined;
    currentState: GroundPatherState
    findPointOnCurrentGround(): void
    findNewGround(): void
    checkIfReachedNode(): boolean
    stopForSomeTime(): void
    stop(): void
    decideIfContinueOrStop(): void
    jump(): void
}

export enum GroundPatherState {
    Wandering,
    Idle,
    Stopped,
    Following,
    Scared
}

export interface GroundPatherOptions extends AIOptions {
    idleTimeRange?: number
}

export class GroundPatherAI extends AI implements IGroundPatherAI {
    _currentGroundRect: Rect
    _currentMaximumDistanceToEdge: number = 0
    _currentNode?: AINode = undefined
    _currentState: GroundPatherState = GroundPatherState.Wandering
    debugger: IGroundPatherDebugger
    jumper: IGroundPatherAIJumper
    
    idleTimeRange: number
    idleTimeout?: number

    constructor(options: GroundPatherOptions) {
        super(options)

        const groundPather = this

        this.jumper = new GroundPatherAIJumper({ groundPather })
        this.debugger = new GroundPatherDebugger({ groundPather })
        this.idleTimeRange = options.idleTimeRange ?? 500
    }

    update() {
        this.debugger.update()
        this.jumper.update()

        if (this._currentGroundRect !== this.target.currentGroundRect) {
            this.currentGroundRect = this.target.currentGroundRect
        }

        if (this.target.organismState == GravityOrganismState.Dead) {
            this.stop()
        } else if (this.currentState === GroundPatherState.Wandering
        && this.currentNode === undefined) {
            this.currentState = GroundPatherState.Idle
        }
         else if (this.currentState === GroundPatherState.Idle
        && this.currentNode === undefined && this.currentGroundRect !== undefined) {
            // this.findNewPoint()
            this.decideIfContinueOrStop()
        }
    }

    findPointOnCurrentGround() {
        // log('GroundPatherAI', 'findPointOnCurrentGround')

        if (this.currentGroundRect === undefined) return

        const direction = this.target.direction
        const currentGroundY = this.currentGroundRect.y
        const baseX = this.target.x
        const maximumDistance = (direction == Direction.Left)
            ? this.target.x - this.currentGroundRect.x
            : this.currentGroundRightEdgeX - this.target.x

        if (maximumDistance < 5) {
            this.target.direction = this.target.direction === Direction.Left ? Direction.Right : Direction.Left
            return this.findPointOnCurrentGround()
        }
        const calculatedDistance = (Math.random() * maximumDistance) * direction

        this._currentMaximumDistanceToEdge = maximumDistance
        this.currentNode = {
            x: baseX + calculatedDistance,
            y: currentGroundY
        } 
    }

    jump() {
        this.target.jump()
    }

    findNewGround() {
        // log('GroundPatherAI', 'findNewGround')
    }

    findNewPoint() {
        // log('GroundPatherAI', 'findNewPoint')

        this.currentState = GroundPatherState.Wandering

        this.decideDirection()
        this.findPointOnCurrentGround()

        // TODO: Find on either new ground, or current
    }

    checkIfReachedNode(): boolean {
        if (this.currentNode === undefined) return true

        let hasReached = false
        const distance = this.target.x - this.currentNode.x

        if (Math.abs(distance) < 1) {
            this.currentNode = undefined
            this.currentState = GroundPatherState.Idle

            hasReached = true
        }

        return hasReached
    }

    decideIfContinueOrStop() {
        // log('GroundPatherAI', 'decideIfContinueOrStop')

        const shouldStop: boolean = (Math.random() > 0.5)

        if (shouldStop) {
            this.stopForSomeTime()
        } else {
            this.findNewPoint()
        }
    }

    decideDirection(): Direction {
        // log('GroundPatherAI', 'decideDirection')

        const direction = (Math.random() > 0.5) ? Direction.Left : Direction.Right

        this.target.direction = direction

        return direction
    }

    stopForSomeTime() {
        // log('GroundPatherAI', 'stopForSomeTime')

        this.stop()

        const randomStopTime = Math.random() * this.idleTimeRange

        if (this.idleTimeout) {
            window.clearTimeout(this.idleTimeout)
        }

        this.idleTimeout = window.setTimeout(() => {
            this.idleTimeout = undefined
            this.currentState = GroundPatherState.Idle
        }, this.idleTimeRange + randomStopTime)  
    }

    stop() {
        if (this.currentState === GroundPatherState.Stopped) return

        this.currentState = GroundPatherState.Stopped
    }

    set currentGroundRect(value: Rect) {
        if (this._currentGroundRect !== value) {
            this._currentGroundRect = value

            this.findPointOnCurrentGround()
        }
    }

    set currentNode(value: AINode | undefined) {
        this._currentNode = value
    }

    get currentState() {
        return this._currentState
    }

    set currentState(value: GroundPatherState) {
        // When destination reached, continue walking, or stop
        if (this.currentState !== value
        && value === GroundPatherState.Idle) {
            this._currentState = value
            this.decideIfContinueOrStop()
        } else {
            this._currentState = value
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
