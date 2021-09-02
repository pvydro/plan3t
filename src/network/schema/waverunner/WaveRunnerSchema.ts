import { Schema, ArraySchema, type } from '@colyseus/schema'
import { PlanetRoom } from '../../rooms/planetroom/PlanetRoom'
import { CreatureSchema } from '../CreatureSchema'

export class WaveSchema extends Schema {
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
}

export class WaveRunnerSchema extends Schema {
    @type(WaveSchema)
    currentWave!: WaveSchema

    initialize() {
        this.currentWave = new WaveSchema().assign({
            waveIndex: 3,
            totalTime: 3000,
            totalEnemies: 5
        })
    }

    update() {
        this.currentWave.elapsedTime += PlanetRoom.Delta
    }
}
