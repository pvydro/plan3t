import { type } from '@colyseus/schema'
import { Entity } from './Entity'


export class Player extends Entity {
    
    @type('int32')
    bodyState: number = 0
    @type('int32')
    direction: number = 1
    @type('int32')
    walkingDirection: number = 1

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
