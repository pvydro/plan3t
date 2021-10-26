import { Schema, ArraySchema, type } from '@colyseus/schema'
import { PlanetRoom } from '../../rooms/planetroom/PlanetRoom'
import { WaveSchema } from './WaveSchema'

export class WaveRunnerSchema extends Schema {
    @type(WaveSchema)
    currentWave: WaveSchema = new WaveSchema()

    update() {
        this.currentWave.elapsedTime += PlanetRoom.Delta
    }
}
