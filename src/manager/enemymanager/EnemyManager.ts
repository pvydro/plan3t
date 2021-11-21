import { CameraLayer } from '../../camera/CameraStage'
import { Enemy, IEnemy } from '../../enemy/Enemy'
import { log } from '../../service/Flogger'
import { entityMan } from '../../shared/Dependencies'

export interface IEnemyManager {
    enemies: Map<string, IEnemy>
    registerEnemy(enemy: Enemy): void
    removeEnemy(enemy: Enemy): void
}

export class EnemyManager implements IEnemyManager {
    enemies: Map<string, IEnemy>

    constructor() {
        this.enemies = new Map()
    }

    registerEnemy(enemy: Enemy) {
        log('EnemyManager', 'registerEnemy', 'id', enemy.entityId)

        this.enemies.set(enemy.entityId, enemy)
        entityMan.registerEntity(enemy.entityId, enemy)
    }

    removeEnemy(enemy: Enemy) {
        log('EnemyManager', 'removeEnemy', 'id', enemy.entityId)

        this.enemies.delete(enemy.entityId)
        entityMan.removeEntity(enemy.entityId, CameraLayer.Creatures)
    }
}
