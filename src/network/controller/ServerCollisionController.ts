import { EntitySchema } from '../schema/EntitySchema'
import { ServerGameState } from '../schema/serverstate/ServerGameState'

export interface IServerCollisionController {
    update(): void
}

export class ServerCollisionController implements IServerCollisionController {
    state: ServerGameState

    constructor(state: ServerGameState) {
        this.state = state
    }

    update(): void {
        this.state.projectiles.forEach((projectile) => {
            if (!projectile.dead) {
                this.state.players.forEach((player) => {
                    if (player.id !== projectile.playerId) {
                        if (this.isColliding(player, projectile)) {
                            projectile.dead = true
                            player.takeDamage(projectile.damage)
                            // this.state.removeProjectile(projectile)
                            // this.state.removePlayer(player)
                        }
                    // && player.position.distanceTo(projectile.position) < player.radius) {
                    //     player.health -= projectile.damage
                    //     this.state.projectiles.delete(projectile.id)
                    }
                })
            }
        })
    }

    isColliding(entityA: EntitySchema, entityB: EntitySchema): boolean {
        let isColliding = false

        if (entityA.x > entityB.x - (entityB.width / 2)
        && entityA.x < entityB.x + (entityB.width / 2)) {
            isColliding = true
        }

        return isColliding
    }
}
