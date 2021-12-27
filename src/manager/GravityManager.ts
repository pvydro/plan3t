import { ClientEntity, EntityType } from '../cliententity/ClientEntity'
import { GravityEntity } from '../cliententity/GravityEntity'
import { GameLoop } from '../gameloop/GameLoop'
import { GameMap } from '../gamemap/GameMap'
import { log } from '../service/Flogger'
import { exists } from '../utils/Utils'
import { Bullet } from '../weapon/projectile/Bullet'
import { CollisionManager, ICollisionManager } from './CollisionManager'
import { IEnemyManager } from './enemymanager/EnemyManager'

export interface IGravityManager {
    initialize(): void
    applyVelocityToEntity(entity: ClientEntity | GravityEntity, checkCollision?: boolean)
}

export interface GravityManagerOptions {
    enemyManager: IEnemyManager
}

export class GravityManager implements IGravityManager {
    private static Instance: GravityManager
    collisionManager: ICollisionManager
    gameMap: GameMap

    constructor(options: GravityManagerOptions) {
        this.gameMap = GameMap.getInstance()
        this.collisionManager = new CollisionManager({
            gameMap: this.gameMap,
            enemyManager: options.enemyManager 
        })
    }

    initialize() {
        log('GravityManager', 'initialize')
    }

    applyVelocityToEntity(entity: ClientEntity | GravityEntity, checkCollision: boolean = true) {
        if (exists(entity) && checkCollision) {
            // if (entity.frozen) return

            // if (entity.type === EntityType.Bullet) {
                // entity = this.collisionManager.checkBulletCollision(entity as Bullet)
            // } else if (entity instanceof GravityEntity) {
            if (entity instanceof GravityEntity) {
                entity = this.collisionManager.checkEntityCollision(entity as GravityEntity)
            }
            
            entity.x += (entity.xVel * GameLoop.Delta)
            entity.y += (entity.yVel * GameLoop.Delta)
        }
        
    }
}
