import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'

export class DimensionSchema extends Schema {
  @type('number')
  width!: number
  @type('number')
  height!: number
}
