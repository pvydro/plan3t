import { Schema, type } from '@colyseus/schema'
import { log } from '../../service/Flogger'
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
    isOnGround: boolean = false
    // @type('number')
    width: number = 16
    // @type('number')
    height: number = 48
    

    // TODO: move to GravityEntitySchema
    jumpHeight: number = 3
    friction: number = 5

    update(deltaTime: number) {
        if (this.isOnGround) {
        // && this.yVel !== 0) {  // yVel !== 0 is interim solution to not check every frame
            this.yVel = 0
        } else {
            this.yVel += ((this.weight / 3) * 1) * deltaTime
        }
    }

    moveLeft() {
        this.xVel = -1.5
    }

    moveRight() {
        this.xVel = 1.5
    }

    takeDamage(damage: number) {
        log('Player', this.id, 'takeDamage', damage)

        this.health -= damage

        console.log(this.health)
        console.log()
    }

    jump() {
        log('Player', 'jump')

        if (!this.isOnGround) return
        
        this.isOnGround = false
        this.yVel = -this.jumpHeight
    }

    comeToStop() {
        const xVel = this.xVel + (0 - this.xVel) / 5//this.horizontalFriction

        this.xVel = xVel
    }
}
