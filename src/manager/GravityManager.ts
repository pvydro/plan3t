import { GravityEntity } from '../cliententity/GravityEntity'
import Bump from '../engine/collision/Bump'
import { Rect } from '../engine/math/Rect'
import { GameMap } from '../gamemap/GameMap'
import { LoggingService } from '../service/LoggingService'

export interface IGravityManager {
    initialize(): void
    registerEntityForCollision(entity: GravityEntity)
}

export interface GravityManagerOptions {
    gameMap: GameMap
}

export class GravityManager implements IGravityManager {
    private static INSTANCE: GravityManager
    bump: Bump
    gameMap: GameMap

    static getInstance() {
        if (GravityManager.INSTANCE === undefined) {
            GravityManager.INSTANCE = new GravityManager()
        }

        return GravityManager.INSTANCE
    }

    private constructor() {
        this.gameMap = GameMap.getInstance()
    }

    initialize() {
        LoggingService.log('GravityManager', 'initialize')
        
        this.bump = new Bump()
    }

    registerEntityForCollision(entity: GravityEntity) {
        LoggingService.log('GravityManager', 'registerEntityForCollision')

        // Loop through game map collidables
        this.gameMapCollidableRects.forEach((collidableRect: Rect) => {
            // this.bump.rectangleCollision
        })
    }

    get gameMapCollidableRects() {
        return this.gameMap.collidableRects
    }
}
