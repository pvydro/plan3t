import { MapSchema, SetSchema } from '@colyseus/schema'
import { ServerGameState } from '../schema/serverstate/ServerGameState'
import { EntitySchema } from '../schema/EntitySchema'
import { ProjectileSchema } from '../schema/ProjectileSchema'

export interface IServerEntityController {
    update(): void
}

export class ServerEntityController implements IServerEntityController {
    state: ServerGameState

    constructor(state: ServerGameState) {
        this.state = state
    }
 
    update() {
        this.applyVelocityToEntity(this.state.players)
        this.applyVelocityToEntity(this.state.projectiles)
        this.applyVelocityToEntity(this.state.creatures)
    }

    applyVelocityToEntity(entity: EntitySchema | MapSchema<any> | SetSchema<any>) {
        if (entity instanceof MapSchema || entity instanceof SetSchema) {
            entity.forEach((e: EntitySchema) => {
                if (e.frozen) return
                
                e.x += e.xVel
                e.y += e.yVel

                // Projectile-specific
                if (e instanceof ProjectileSchema) {
                    if (e.dead) {
                        this.state.projectiles.delete(e.id)
                    }
                }
            })
        } else {
            if (entity.frozen) return
            entity.x += entity.xVel
            entity.y += entity.yVel
        }
    }
}
