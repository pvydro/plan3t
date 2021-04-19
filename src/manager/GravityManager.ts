import { ClientEntity, EntityType } from '../cliententity/ClientEntity'
import { GravityEntity } from '../cliententity/GravityEntity'
import { GameLoop } from '../gameloop/GameLoop'
import { GameMap } from '../gamemap/GameMap'
import { log } from '../service/Flogger'
import { exists } from '../utils/Utils'
import { Bullet } from '../weapon/projectile/Bullet'
import { CollisionManager, ICollisionManager } from './CollisionManager'

export interface IGravityManager {
    initialize(): void
    applyVelocityToEntity(entity: ClientEntity | GravityEntity, checkCollision?: boolean)
}

export interface GravityManagerOptions {
    gameMap: GameMap
}

export class GravityManager implements IGravityManager {
    private static Instance: GravityManager
    collisionManager: ICollisionManager
    gameMap: GameMap

    static getInstance() {
        if (GravityManager.Instance === undefined) {
            GravityManager.Instance = new GravityManager()
        }

        return GravityManager.Instance
    }

    private constructor() {
        this.gameMap = GameMap.getInstance()
        this.collisionManager = new CollisionManager({
            gameMap: this.gameMap
        })
    }

    initialize() {
        log('GravityManager', 'initialize')
    }

    applyVelocityToEntity(entity: ClientEntity | GravityEntity, checkCollision: boolean = true) {
        if (exists(entity) && checkCollision) {
            // if (Object.getPrototypeOf(entity) === Bullet.prototype) {
            //     entity = this.collisionManager.checkBulletCollision(entity as Bullet)
            // } else 
            if (entity.type === EntityType.Bullet) {
                entity = this.collisionManager.checkBulletCollision(entity as Bullet)
            } else if (entity instanceof GravityEntity) {
                entity = this.collisionManager.checkEntityCollision(entity as GravityEntity)
            }
            
            entity.x += (entity.xVel * GameLoop.Delta)
            entity.y += (entity.yVel * GameLoop.Delta)
        }
        
    }
}
