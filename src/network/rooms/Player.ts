import { Schema, type } from '@colyseus/schema'
import { Flogger } from '../../service/Flogger'
import { Direction, PlayerBodyState, PlayerLegsState } from '../utils/Enum'
import { Entity } from './Entity'

class PlayerWeaponStatus extends Schema {
    @type('float64')
    rotation: number = 0
    @type('string')
    name: string = ''
}

export class Player extends Entity {
    @type(PlayerWeaponStatus)
    weaponStatus: PlayerWeaponStatus = new PlayerWeaponStatus({
        rotation: 0,
        name: ''
    })
    @type('int32')
    bodyState: PlayerBodyState = PlayerBodyState.Idle
    @type('int32')
    legsState: PlayerLegsState = PlayerLegsState.Standing
    @type('int32')
    direction: Direction = Direction.Right
    @type('int32')
    walkingDirection: Direction = Direction.Right
    @type('float32')
    weight: number = 0.5
    @type('float32')
    handRotation: number = 0
    @type('boolean')
    hasSpawned: boolean = false
    @type('boolean')
    isOnGround: boolean = true

    moveLeft() {
        this.xVel = -1.5
    }

    moveRight() {
        this.xVel = 1.5
    }

    jump() {
        Flogger.log('Player', 'jump')
        
        this.yVel = 5 //-PlayerController.playerJumpingHeight
    }

    comeToStop() {
        const xVel = this.xVel + (0 - this.xVel) / 5//this.horizontalFriction

        this.xVel = xVel
    }
}
