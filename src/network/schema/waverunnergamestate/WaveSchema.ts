import { Schema, ArraySchema, type } from '@colyseus/schema'
import { PlanetRoom } from '../../rooms/planetroom/PlanetRoom'
import { MapBuildingType } from '../../utils/Enum'
import { CreatureSchema } from '../CreatureSchema'

export class WaveSchema extends Schema {
    @type('string')
    currentMap: MapBuildingType = MapBuildingType.Castle
    @type('number')
    waveIndex: number = 3
    @type('number')
    totalTime!: number
    @type('number')
    elapsedTime: number = 0
    @type('number')
    totalEnemies: number = 0
    @type([ CreatureSchema ])
    currentEnemies!: ArraySchema<CreatureSchema>

    update() {
        this.elapsedTime += PlanetRoom.Delta
    }
}
