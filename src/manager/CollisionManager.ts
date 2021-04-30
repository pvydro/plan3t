import { GravityEntity } from '../cliententity/GravityEntity'
import { IEnemy } from '../enemy/Enemy'
import { IRect, Rect } from '../engine/math/Rect'
import { GameMap } from '../gamemap/GameMap'
import { GlobalScale } from '../utils/Constants'
import { Bullet } from '../weapon/projectile/Bullet'
import { EnemyManager, IEnemyManager } from './enemymanager/EnemyManager'
import { EntityManager, IEntityManager } from './entitymanager/EntityManager'

export interface ICollisionManager {
    checkEntityCollision(entity: GravityEntity): GravityEntity
    checkBulletCollision(bullet: Bullet): Bullet
}

export interface CollisionManagerOptions {
    gameMap: GameMap
    enemyManager: IEnemyManager
}

export class CollisionManager implements ICollisionManager {
    gameMap: GameMap
    enemyManager: IEnemyManager

    constructor(options: CollisionManagerOptions) {
        this.gameMap = options.gameMap
        this.enemyManager = options.enemyManager
    }

    checkEntityCollision(entity: GravityEntity): GravityEntity {
        entity = this.checkEntityCollisionAgainstMap(entity)

        return entity
    }

    checkBulletCollision(bullet: Bullet): Bullet {
        for (var i in this.gameMapCollidableRects) {
            const rect = this.gameMapCollidableRects[i]
            
            if (rect.contains(bullet.x, bullet.y)) {
                bullet.demolishWithStyle()
            }
        }

        if (this.checkEntityCollisionAgainstEnemies(bullet)) {
            bullet.demolishWithStyle()
        }

        return bullet
    }
    
    private checkEntityCollisionAgainstMap(entity: GravityEntity): GravityEntity {
        for (var i in this.gameMapCollidableRects) {
            const rect = this.gameMapCollidableRects[i]
            entity = this.checkGroundCollision(entity, rect)
        }

        return entity
    }

    private checkEntityCollisionAgainstEnemies(entity: GravityEntity): boolean {
        let hit = false
        const enemies = EntityManager.getInstance().enemyManager.enemies

        enemies.forEach((enemy: IEnemy) => {
            if (enemy.boundingBox && entity.boundingBox) {
                if (Rect.intersects(enemy.boundsWithPosition, entity.boundsWithPosition)) {

                    hit = true

                    if (entity instanceof Bullet) {
                        enemy.takeDamage(10)
                    }

                }
            }

        })

        return hit
    }

    /**
     * Check if yVel will pass block, if so, set yvel to max without passing.
    */
    private checkGroundCollision(entity: GravityEntity, collisionRect: Rect): GravityEntity {
        // TODO: This logic needs to be handled in an Intersects class of sorts.
        const entityBounds = entity.boundingBox
        const heightOffsetMultiplier = -entity.gravityAnchor.y ?? 0
        const heightOffset = entityBounds.height * heightOffsetMultiplier
        const entityBottomY = entity.y + ((entityBounds.height + heightOffset) * GlobalScale)
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
