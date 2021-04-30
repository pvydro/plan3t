import { CameraLayer } from '../../camera/CameraStage'
import { Enemy, IEnemy } from '../../enemy/Enemy'
import { log } from '../../service/Flogger'
import { EntityManager, IEntityManager } from '../entitymanager/EntityManager'

export interface IEnemyManager {
    enemies: Map<string, IEnemy>
    registerEnemy(enemy: Enemy): void
    removeEnemy(enemy: Enemy): void
}

export interface EnemyManagerOptions {
    entityManager: IEntityManager
}

// TODO: EntityEnemyCreator, follow path of EntityCreatureCreator
export class EnemyManager implements IEnemyManager {
    private static Instance: IEnemyManager
    entityManager: IEntityManager
    enemies: Map<string, IEnemy>

    constructor(options: EnemyManagerOptions) {
        this.entityManager = options.entityManager
        this.enemies = new Map()
    }

    registerEnemy(enemy: Enemy) {
        log('EnemyManager', 'registerEnemy', 'id', enemy.entityId)

        this.enemies.set(enemy.entityId, enemy)
        this.entityManager.registerEntity(enemy.entityId, enemy)
    }

    removeEnemy(enemy: Enemy) {
        log('EnemyManager', 'removeEnemy', 'id', enemy.entityId)

        this.enemies.delete(enemy.entityId)
        this.entityManager.removeEntity(enemy.entityId, CameraLayer.Creatures)
    }
}
