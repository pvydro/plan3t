import { Enemy } from '../../enemy/Enemy'
import { log } from '../../service/Flogger'
import { EntityManager, IEntityManager } from '../entitymanager/EntityManager'

export interface IEnemyManager {

}

export class EnemyManager implements IEnemyManager {
    private static Instance: IEnemyManager
    entityManager: IEntityManager

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new EnemyManager()
        }

        return this.Instance
    }

    private constructor() {
        this.entityManager = EntityManager.getInstance()
    }

    registerEnemy(enemy: Enemy) {
        log('EnemyManager', 'registerEnemy', 'id', enemy.entityId)

        this.entityManager.registerEntity(enemy.entityId, {
            clientEntity: enemy
        })
    }
}
