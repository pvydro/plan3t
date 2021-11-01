import { type, Schema } from '@colyseus/schema'

export class Vector2Schema extends Schema {
    @type('float64')
    x!: number
    @type('float64')
    y!: number

    constructor(x: number, y: number) {
        super()
        this.x = x
        this.y = y
    }
}
