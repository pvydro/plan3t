import { GravityEntity } from '../cliententity/GravityEntity'
import { IEnemy } from '../enemy/Enemy'
import { Rect } from '../engine/math/Rect'
import { GameMap } from '../gamemap/GameMap'
import { entityMan } from '../shared/Dependencies'
import { Bullet } from '../weapon/projectile/Bullet'
import { IEnemyManager } from './enemymanager/EnemyManager'

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

            if (this.checkGroundCollision(entity, rect)) {
                entity.landedOnGround(rect)
            }

            if (this.checkSideCollision(entity, rect)) {
                entity.hitWall(rect)
            }
        }

        return entity
    }

    private checkEntityCollisionAgainstEnemies(entity: GravityEntity): boolean {
        let hit = false
        const enemies = entityMan.enemyManager.enemies

        // if (!Environment.IsHost) return

        enemies.forEach((enemy: IEnemy) => {
            if (enemy.boundingBox && entity.boundingBox) {
                if (Rect.intersects(enemy.boundsWithPosition, entity.boundsWithPosition)) {
                    hit = true

                    if (entity instanceof Bullet) {
                        enemy.takeDamage(entity.damage)
                    }
                }
            }
        })

        return hit
    }

    /**
     * Check if yVel will pass block, if so, set yvel to max without passing.
    */
    private checkGroundCollision(entity: GravityEntity, collisionRect: Rect): boolean {
        const rectRightSide = collisionRect.x + collisionRect.width
        const isSolidOnBottom = entity.bottomY <= collisionRect.y
        const isWithinLeftBounds = entity.x >= collisionRect.x
        const isWithinRightBounds = entity.x <= rectRightSide

        // Check if above, and within horizontally, rectangle
        if (isSolidOnBottom && isWithinLeftBounds && isWithinRightBounds) {
            // Check if entity + entity yVel will collide
            if (entity.bottomY + entity.yVel >= collisionRect.y) {
                return true
            }
        }

        return false
    }

    private checkSideCollision(entity: GravityEntity, collisionRect: Rect): boolean {
        const entityBounds = entity.boundsWithVelocity

        

        // if (entity.middleY > collisionRect.y) {
        //     if (Rect.intersects(entityBounds, collisionRect)) {
        //         return true
        //     }
        // }

        // if (collisionRect.y <= (entity.y + (entityBounds.height / 2))) {
        //     if (entity.rightX + entity.xVel >= collisionRect.x) {
        //         // const difference = collisionRect.x - entity.rightX

        //         // entity.xVel = difference
        //     }
        // }

        return false
    }

    get gameMapCollidableRects() {
        return this.gameMap.collidableRects
    }
}
