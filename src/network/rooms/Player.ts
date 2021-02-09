import { type } from '@colyseus/schema'
import { Entity } from './Entity'

export enum PlayerBodyState {
    Idle = 0,
    Walking = 1,
    Jumping = 2
}

export class Player extends Entity {
    @type('int32')
    bodyState!: number
    @type('int32')
    direction!: number
}
