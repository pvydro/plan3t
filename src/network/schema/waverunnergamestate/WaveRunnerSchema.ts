import { Schema, ArraySchema, type } from '@colyseus/schema'
import { log } from '../../../service/Flogger'
import { WaveSchema } from './WaveSchema'

export class WaveRunnerSchema extends Schema {
    @type(WaveSchema)
    currentWave: WaveSchema = new WaveSchema()

    update() {
        this.currentWave.update()

        if (this.currentWave.complete) {
            this.nextWave()
        }
    }

    nextWave() {
        log('WaveRunnerSchema', 'nextWave')

        const nextWaveIndex = this.currentWave.waveIndex + 1

        this.currentWave = new WaveSchema().assign({
            waveIndex: nextWaveIndex
        })
    }
}
