import { Schema, ArraySchema, type } from '@colyseus/schema'
import { PlanetRoom } from '../../rooms/planetroom/PlanetRoom'
import { MapBuildingType } from '../../utils/Enum'
import { CreatureSchema } from '../CreatureSchema'

export class WaveSchema extends Schema {
    @type('string')
    currentMap: MapBuildingType = MapBuildingType.Castle
    @type('number')
    waveIndex: number = 1
    @type('number')
    totalTime: number = 3000
    @type('number')
    elapsedTime: number = 0
    @type('number')
    totalEnemies: number = 0
    @type('boolean')
    complete: boolean = false

    update() {
        this.elapsedTime += PlanetRoom.Delta

        if (this.elapsedTime >= this.totalTime) {
            this.complete = true
        }
    }
}
