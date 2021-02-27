import { GravityParticle } from '../../engine/display/particle/GravityParticle'
import { GameMap } from '../../gamemap/GameMap'


export interface IParticleCollisionManager {
    checkParticleCollision(particle: GravityParticle): GravityParticle
}

export class ParticleCollisionManager implements IParticleCollisionManager {
    gameMap: GameMap

    constructor() {
        this.gameMap = GameMap.getInstance()
    }

    checkParticleCollision(particle: GravityParticle) {
        for (var i in this.gameMapCollidableRects) {
            const rect = this.gameMapCollidableRects[i]
            const particleBottomY = particle.y + particle.height
            const particleRightX = particle.x + particle.width

            if (particleBottomY > rect.y) {
                if (particle.x > rect.x && particleRightX < rect.x + rect.width) {
                    particle.landedOnGround(rect)
                }
            }
        }

        return particle
    }

    get gameMapCollidableRects() {
        return this.gameMap.collidableRects
    }
}
