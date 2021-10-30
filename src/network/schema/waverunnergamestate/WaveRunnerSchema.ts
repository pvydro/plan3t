import { Schema, type } from '@colyseus/schema'
import { log } from '../../../service/Flogger'
import { WaveSchema } from './WaveSchema'
import { IWaveCreatureSpawner, WaveCreatureSpawner } from './WaveCreatureSpawner'
import { WaveRunnerGameState } from './WaveRunnerGameState'
import { CreatureType } from '../../utils/Enum'

export class WaveRunnerSchema extends Schema {
    @type(WaveSchema)
    currentWave: WaveSchema = new WaveSchema()
    spawner: IWaveCreatureSpawner

    constructor(gameState: WaveRunnerGameState) {
        super()
        this.spawner = new WaveCreatureSpawner({
            gameState,
            spawnPoints: [ 0, 50 ]
        })

        this.nextWave()
    }

    update() {
        this.currentWave.update()

        if (this.currentWave.complete) {
            this.nextWave()
        }
    }

    nextWave() {
        log('WaveRunnerSchema', 'nextWave')

        const nextWaveIndex = this.currentWave.waveIndex + 1

        this.currentWave = new WaveSchema().assign({ waveIndex: nextWaveIndex})

        this.spawner.start({
            type: CreatureType.Sorm, // [ CreatureType.Sorm, CreatureType.Nenji ]
            spawnCount: 5,
            spawnCountVariance: 3,
            timeBetweenSpawnsVariance: 500,
            timeBetweenSpawns: 500,
        })

        this.currentWave.assign({
            waveIndex: nextWaveIndex,
            totalEnemies: this.spawner.spawnCount
        })
    }
}
