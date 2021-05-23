import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { CreatureType } from '../creature/CreatureType'
import { Enemy } from '../enemy/Enemy'
import { IEnemyManager } from '../manager/enemymanager/EnemyManager'
import { EntityManager } from '../manager/entitymanager/EntityManager'
import { importantLog, log } from '../service/Flogger'
import { CreatureSpawner, ICreatureSpawner } from '../spawner/creaturespawner/CreatureSpawner'
import { IWave } from './Wave'

export interface IWaveRunnerGame {
    spawner: ICreatureSpawner
    currentWave: IWave
    beginWaveRunner(): void
    loadWave(wave: IWave): void
}

export class WaveRunnerGame implements IWaveRunnerGame {
    _spawner: ICreatureSpawner
    currentWave: IWave
    enemyManager: IEnemyManager

    constructor() {
        this.enemyManager = EntityManager.getInstance().enemyManager
    }

    beginWaveRunner() {
        importantLog('WaveRunnerGame', 'beginWaveRunner')

        this._spawner = new CreatureSpawner({
            typeToSpawn: CreatureType.Sorm,
            onSpawn: (enemy: Enemy) => {
                log('WaveRunnerGame', 'spawner.onSpawn', 'entityId', (enemy && enemy.entityId) ?? 'Not defined')

                this.enemyManager.registerEnemy(enemy)

                Camera.getInstance().stage.addChildAtLayer(enemy, CameraLayer.Creatures)
            }
        })
    }

    loadWave(wave: IWave) {
        this.currentWave = wave

        wave.startSpawnIntervals()

        // InGameHUD.getInstance().loadWave(this.currentWave)
    }

    get spawner() {
        return this._spawner
    }
}
