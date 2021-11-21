import { type } from '@colyseus/schema'
import { EntitySchema } from './EntitySchema'

export class ProjectileSchema extends EntitySchema {
    @type('string')
    playerId!: string
    @type('number')
    rotation!: number
    @type('number')
    xVel!: number
    @type('number')
    yVel!: number
}
