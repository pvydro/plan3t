import { ClientEntity } from '../cliententity/ClientEntity'
import { GravityEntity } from '../cliententity/GravityEntity'
import { GameMap } from '../gamemap/GameMap'
import { Flogger } from '../service/Flogger'
import { CollisionManager, ICollisionManager } from './CollisionManager'

export interface IGravityManager {
    initialize(): void
    applyVelocityToEntity(entity: ClientEntity | GravityEntity, checkCollision?: boolean)
}

export interface GravityManagerOptions {
    gameMap: GameMap
}

export class GravityManager implements IGravityManager {
    private static INSTANCE: GravityManager
    collisionManager: ICollisionManager
    gameMap: GameMap

    static getInstance() {
        if (GravityManager.INSTANCE === undefined) {
            GravityManager.INSTANCE = new GravityManager()
        }

        return GravityManager.INSTANCE
    }

    private constructor() {
        this.gameMap = GameMap.getInstance()
        this.collisionManager = new CollisionManager({
            gameMap: this.gameMap
        })
    }

    initialize() {
        Flogger.log('GravityManager', 'initialize')
    }

    applyVelocityToEntity(entity: ClientEntity | GravityEntity, checkCollision: boolean = true) {
        if (checkCollision && entity instanceof GravityEntity) {
            entity = this.collisionManager.checkEntityCollision(entity as GravityEntity)
        }
        
        entity.x += entity.xVel
        entity.y += entity.yVel
    }
}
