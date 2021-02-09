import { Schema, type } from '@colyseus/schema'

export class Entity extends Schema {
    @type('float64')
    x: number = 0
    @type('float64')
    y: number = 0
    @type('float64')
    xVel: number = 0
    @type('float64')
    yVel: number = 0
    @type('float32')
    weight: number = 0

    dead: boolean = false

    static distance(a: Entity, b: Entity) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
    }
}
