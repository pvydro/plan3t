import { Camera } from '../camera/Camera'
import { ClientEntity } from '../cliententity/ClientEntity'
import { GravityEntity } from '../cliententity/GravityEntity'
import { CollisionDebugger } from '../engine/collision/CollisionDebugger'
import { Rect } from '../engine/math/Rect'
import { Vector2 } from '../engine/math/Vector2'
import { GameMap } from '../gamemap/GameMap'
import { SphericalHelper } from '../gamemap/spherical/SphericalHelper'
import { LoggingService } from '../service/LoggingService'
import { GlobalScale } from '../utils/Constants'

export interface IGravityManager {
    initialize(): void
    registerEntityForCollision(entity: GravityEntity)
    applyVelocityToEntity(entity: ClientEntity | GravityEntity, checkCollision?: boolean)
}

export interface GravityManagerOptions {
    gameMap: GameMap
}

export class GravityManager implements IGravityManager {
    private static INSTANCE: GravityManager
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
    }

    registerEntityForCollision(entity: GravityEntity) {
        LoggingService.log('GravityManager', 'registerEntityForCollision')

        // Loop through game map collidables
        this.gameMapCollidableRects.forEach((collidableRect: Rect) => {
            // console.log(collidableRect.x)
            // this.bump.rectangleCollision(collidableRect, entity.boundingBox, true)
        })
    }

    applyVelocityToEntity(entity: ClientEntity | GravityEntity, checkCollision: boolean = true) {
        if (checkCollision && entity instanceof GravityEntity) {
            entity = this.checkEntityCollision(entity as GravityEntity)
        }
        
        entity.x += entity.xVel
        entity.y += entity.yVel
    }

    checkEntityCollision(entity: GravityEntity): GravityEntity {
        entity = this.checkEntityCollisionAgainstMap(entity)

        return entity
    }

    private checkEntityCollisionAgainstMap(entity: GravityEntity): GravityEntity {
        const camera = Camera.getInstance()
        const entityBounds = entity.boundingBox
        const entityBottomY = entity.y + (entityBounds.width * GlobalScale)
        const centerX = entity.x

        const debug = new CollisionDebugger({ collisionRects: this.gameMapCollidableRects })
        debug.initializeAndShowGraphics()
        camera.viewport.addChild(debug)

        this.gameMapCollidableRects.forEach((rect: Rect, i) => {
            // Check if yVel will pass block, if so, set yvel to max without passed
            const rectLeftSide = rect.x
            const rectRightSide = rect.x + rect.width
            const rectBottomSide = rect.y

            console.log(centerX)
            console.log(i, 'left', rectLeftSide, 'right', rectRightSide, 'bottom', rectBottomSide, 'x', rect.x, 'y', rect.y)
            console.log('bottomY', entityBottomY)

            // Check if above, and within horizontally, rectangle
            if (entityBottomY <= rectBottomSide
            && centerX >= rectLeftSide
            && centerX <= rectRightSide) {
                if (entityBottomY + entity.yVel >= rect.y) {
                    console.log('collided! ', i)
                    
                    entity.yVel = 0
                }
            }
        })

        return entity
    }

    get gameMapCollidableRects() {
        return this.gameMap.collidableRects
    }
}
