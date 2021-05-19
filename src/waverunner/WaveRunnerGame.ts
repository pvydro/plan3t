import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { CreatureType } from '../creature/CreatureType'
import { Enemy } from '../enemy/Enemy'
import { EnemyManager, IEnemyManager } from '../manager/enemymanager/EnemyManager'
import { EntityManager } from '../manager/entitymanager/EntityManager'
import { Flogger, importantLog, log } from '../service/Flogger'
import { CreatureSpawner, ICreatureSpawner } from '../spawner/creaturespawner/CreatureSpawner'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { IWave, Wave } from './Wave'

export interface IWaveRunnerGame {
    beginWaveRunner(): void
}

export class WaveRunnerGame implements IWaveRunnerGame {
    wave: IWave
    spawner: ICreatureSpawner
    enemyManager: IEnemyManager

    constructor() {
        this.enemyManager = EntityManager.getInstance().enemyManager
    }

    beginWaveRunner() {
        importantLog('WaveRunnerGame', 'beginWaveRunner')

        this.spawner = new CreatureSpawner({
            typeToSpawn: CreatureType.Sorm,
            onSpawn: (enemy: Enemy) => {
                log('WaveRunnerGame', 'spawner.onSpawn', 'entityId', (enemy && enemy.entityId) ?? 'Not defined')

                this.enemyManager.registerEnemy(enemy)

                Camera.getInstance().stage.addChildAtLayer(enemy, CameraLayer.Creatures)
            }
        })
        this.wave = new Wave({
            onSpawn: () => {
                this.spawner.spawn()
            }
        })
        this.wave.startSpawnIntervals()

        InGameHUD.getInstance().loadWave(this.wave)
    }
}
