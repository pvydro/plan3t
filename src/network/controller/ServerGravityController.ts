import { MapSchema, SetSchema } from '@colyseus/schema'
import { ServerGameState } from '../schema/serverstate/ServerGameState'
import { EntitySchema } from '../schema/EntitySchema'
import { exists } from '../../utils/Utils'

export interface IServerGravityController {
    update(): void
}

export class ServerGravityController implements IServerGravityController {
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
                if (exists(e.x) && exists(e.xVel)) {
                    e.x += e.xVel
                    e.y += e.yVel
                }
            })
        } else {
            entity.x += entity.xVel
            entity.y += entity.yVel
        }
    }
}
