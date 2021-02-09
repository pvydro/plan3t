import { type } from '@colyseus/schema'
import { Direction, PlayerBodyState, PlayerLegsState } from '../utils/Enum'
import { Entity } from './Entity'

export class Player extends Entity {
    @type('int32')
    bodyState: PlayerBodyState = PlayerBodyState.Idle
    @type('int32')
    legsState: PlayerLegsState = PlayerLegsState.Standing
    @type('int32')
    direction: Direction = Direction.Right
    @type('int32')
    walkingDirection: Direction = Direction.Right

    moveLeft() {
        this.xVel = -1.5
    }

    moveRight() {
        this.xVel = 1.5
    }

    comeToStop() {
        const xVel = this.xVel + (0 - this.xVel) / 5//this.horizontalFriction

        this.xVel = xVel
    }
}
