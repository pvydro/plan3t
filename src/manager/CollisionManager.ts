import { GravityEntity } from '../cliententity/GravityEntity'
import { Rect } from '../engine/math/Rect'
import { GameMap } from '../gamemap/GameMap'
import { GlobalScale } from '../utils/Constants'
import { Bullet } from '../weapon/projectile/Bullet'

export interface ICollisionManager {
    checkEntityCollision(entity: GravityEntity): GravityEntity
    checkBulletCollision(bullet: Bullet): Bullet
}

export interface CollisionManagerOptions {
    gameMap: GameMap
}

export class CollisionManager implements ICollisionManager {
    gameMap: GameMap

    constructor(options: CollisionManagerOptions) {
        this.gameMap = options.gameMap
    }

    checkEntityCollision(entity: GravityEntity): GravityEntity {
        entity = this.checkEntityCollisionAgainstMap(entity)

        return entity
    }

    checkBulletCollision(bullet: Bullet): Bullet {
        

        return bullet
    }
    
    private checkEntityCollisionAgainstMap(entity: GravityEntity): GravityEntity {
        this.gameMapCollidableRects.forEach((rect: Rect, i) => {
            entity = this.checkGroundCollision(entity, rect)
            // entity = this.checkSideCollision(entity, rect)
        })

        return entity
    }

    /**
     * Check if yVel will pass block, if so, set yvel to max without passing.
    */
    private checkGroundCollision(entity: GravityEntity, collisionRect: Rect): GravityEntity {

        // TODO: This logic needs to be handled in a Intersects class of sorts.

        const entityBounds = entity.boundingBox
        const entityBottomY = entity.y + (entityBounds.width * GlobalScale)
        const centerX = entity.x
        const rectLeftSide = collisionRect.x
        const rectRightSide = collisionRect.x + collisionRect.width
        const rectBottomSide = collisionRect.y

        // Check if above, and within horizontally, rectangle
        if (entityBottomY <= rectBottomSide
        && centerX >= rectLeftSide
        && centerX <= rectRightSide) {
            // Check if entity + entity yVel will collide
            if (entityBottomY + entity.yVel >= collisionRect.y) {
                const difference = collisionRect.y - entityBottomY
                entity.yVel = difference
                entity.landedOnGround(collisionRect)
            }
        }

        return entity
    }

    private checkSideCollision(entity: GravityEntity, collisionRect: Rect): GravityEntity {
        const entityBounds = entity.boundingBox
        const entityRightX = entity.x + ((entityBounds.width / 2) * GlobalScale)
        const entityLeftX = entity.x - ((entityBounds.width / 2) * GlobalScale)

        if (collisionRect.y <= (entity.y + (entityBounds.height / 2))) {
            if (entityRightX + entity.xVel >= collisionRect.x) {
                const difference = collisionRect.x - entityRightX
                entity.xVel = difference
            }
        }

        return entity
    }

    get gameMapCollidableRects() {
        return this.gameMap.collidableRects
    }
}
