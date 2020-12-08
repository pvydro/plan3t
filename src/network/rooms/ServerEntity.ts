import { Schema, type } from '@colyseus/schema'

export class ServerEntity extends Schema {
    @type('float64')
    x!: number
    @type('float64')
    y!: number
    @type('float32')
    radius!: number
    @type('string')
    type!: string

    dead: boolean = false

    // static distance(a: ServerEntity, b: Entity) {
    //     return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
    // }
}
