import { Schema, type } from '@colyseus/schema'
import { Flogger } from '../../service/Flogger'
import { Direction, PlayerBodyState, PlayerLegsState } from '../utils/Enum'
import { EntitySchema } from './EntitySchema'

class PlayerWeaponStatus extends Schema {
    @type('float64')
    rotation: number = 0
    @type('string')
    name: string = ''
}

export class PlayerSchema extends EntitySchema {
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
    

    // TODO: move to GravityEntitySchema
    jumpHeight: number = 5
    friction: number = 5

    update(deltaTime: number) {
        // switch (this.bodyState) {
        //     case PlayerBodyState.Idle:
        //         if (this.xVel !== 0) {
        //             this.xVel += ((0 - this.xVel) / this.friction) * deltaTime
        //         }
        //         break
        //     case PlayerBodyState.Walking:
        //         break
        // }

        // switch (this.legsState) {
        //     case PlayerLegsState.Jumping:
        //         if (this.isOnGround) {
        //             this.yVel = -this.jumpHeight
        //             this.isOnGround = false
        //         }
        //         break
        // }

        // if (!this.isOnGround && this.yVel !== 0) {  // yVel !== 0 is interim solution to not check every frame
        //     this.yVel += ((this.weight / 3) * 1) * deltaTime
        // }    
    }

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
