import { Schema, type } from '@colyseus/schema'

export class EntitySchema extends Schema {
    @type('string')
    id!: string
    @type('float64')
    x!: number 
    @type('float64')
    y!: number
    @type('number')
    width: number = 16
    @type('number')
    height: number = 16
    @type('float64')
    xVel!: number
    @type('float64')
    yVel!: number
    @type('float32')
    weight!: number
    @type('boolean')
    frozen: boolean = false

    dead: boolean = false

    static distance(a: EntitySchema, b: EntitySchema) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
    }
}
