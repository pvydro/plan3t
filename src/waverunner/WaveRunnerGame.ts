import { CreatureType } from '../creature/Creature'
import { Flogger, log } from '../service/Flogger'
import { CreatureSpawner, ICreatureSpawner } from '../spawner/creaturespawner/CreatureSpawner'
import { IWave, Wave } from './Wave'

export interface IWaveRunnerGame {
    beginWaveRunner(): void
}

export class WaveRunnerGame implements IWaveRunnerGame {
    wave: IWave
    spawner: ICreatureSpawner

    constructor() {

    }

    beginWaveRunner() {
        Flogger.color('tomato')
        log('WaveRunnerGame', 'beginWaveRunner')

        this.spawner = new CreatureSpawner({
            typeToSpawn: CreatureType.Sorm
        })
        this.wave = new Wave({
            onSpawn: () => {
                this.spawner.spawn()
            }
        })
        
        this.wave.startSpawnIntervals()
    }
}
