import { ClientEntity } from '../cliententity/ClientEntity'
import { CreatureType } from '../creature/Creature'
import { Enemy } from '../enemy/Enemy'
import { EnemyManager, IEnemyManager } from '../manager/enemymanager/EnemyManager'
import { Flogger, log } from '../service/Flogger'
import { CreatureSpawner, ICreatureSpawner } from '../spawner/creaturespawner/CreatureSpawner'
import { IWave, Wave } from './Wave'

export interface IWaveRunnerGame {
    beginWaveRunner(): void
}

export class WaveRunnerGame implements IWaveRunnerGame {
    wave: IWave
    spawner: ICreatureSpawner
    enemyManager: IEnemyManager

    constructor() {
        this.enemyManager = EnemyManager.getInstance()
    }

    beginWaveRunner() {
        Flogger.color('tomato')
        log('WaveRunnerGame', 'beginWaveRunner')

        this.spawner = new CreatureSpawner({
            typeToSpawn: CreatureType.Sorm,
            onSpawn: (enemy: Enemy) => {
                log('WaveRunnerGame', 'spawner.onSpawn', 'entityId', (enemy && enemy.entityId) ?? 'Not defined')

                this.enemyManager.registerEnemy(enemy)
            }
        })
        this.wave = new Wave({
            onSpawn: () => {
                this.spawner.spawn()
            }
        })
        
        this.wave.startSpawnIntervals()
    }
}
