import { Schema, ArraySchema, type } from '@colyseus/schema'
import { DimensionSchema } from '../DimensionSchema'


export class PlanetSphericalTileDataSchema extends Schema {
    @type('number')
    r!: number
    @type('number')
    g!: number
    @type('number')
    b!: number
    @type('number')
    a!: number
}

export class PlanetSphericalTileSchema extends Schema {
    @type('number')
    x!: number
    @type('number')
    y!: number
    @type('number')
    tileSolidity!: number
    @type(PlanetSphericalTileDataSchema)
    tileValue!: PlanetSphericalTileDataSchema
}

export class PlanetSphericalSchema extends Schema {
    @type('string')
    biome!: string
    @type(DimensionSchema)
    dimension!: DimensionSchema
    @type([ PlanetSphericalTileSchema ])
    points!: ArraySchema<PlanetSphericalTileSchema>
}
