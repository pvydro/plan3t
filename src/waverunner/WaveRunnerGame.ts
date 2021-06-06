import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { Creature } from '../creature/Creature'
import { CreatureType } from '../creature/CreatureType'
import { Enemy } from '../enemy/Enemy'
import { IUpdatable } from '../interface/IUpdatable'
import { IEnemyManager } from '../manager/enemymanager/EnemyManager'
import { EntityManager } from '../manager/entitymanager/EntityManager'
import { importantLog, log } from '../service/Flogger'
import { CreatureSpawner, ICreatureSpawner } from '../spawner/creaturespawner/CreatureSpawner'
import { IWave } from './Wave'

export interface IWaveRunnerGame extends IUpdatable {
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

    update() {
        if (this.currentWave) {
            this.currentWave.update()
        }
    }

    beginWaveRunner() {
        importantLog('WaveRunnerGame', 'beginWaveRunner')

        this._spawner = new CreatureSpawner({
            typeToSpawn: CreatureType.Sorm,     //  TODO: MULTIPLE
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
    }

    get spawner() {
        return this._spawner
    }
}
