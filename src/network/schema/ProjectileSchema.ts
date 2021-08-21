import { type } from '@colyseus/schema'
import { EntitySchema } from './EntitySchema'

export class ProjectileSchema extends EntitySchema {
    @type('string')
    sessionId!: string
    @type('number')
    rotation!: number
    @type('number')
    velocity!: number
}