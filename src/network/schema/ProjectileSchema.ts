import { type } from '@colyseus/schema'
import { Entity } from '../rooms/Entity'

export class ProjectileSchema extends Entity {
    @type('string')
    sessionId!: string
    @type('number')
    rotation!: number
    @type('number')
    velocity!: number
}
