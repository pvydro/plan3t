import { ClientPlayer } from '../ClientPlayer'
import { PlayerStatePack } from './PlayerStatePack'

export interface PlayerPackRules {
    includePosition?: boolean
    includeVelocity?: boolean
}

export class PlayerStateFormatter {
    private constructor() {}

    static convertPlayerToPack(player: ClientPlayer, rules?: PlayerPackRules): PlayerStatePack {
        const payload: PlayerStatePack | any = {}

        payload.direction = player.direction as number
        payload.walkingDirection = player.walkingDirection as number
        payload.bodyState = player.bodyState as number
        payload.legsState = player.legsState as number
        payload.isOnGround = player.isOnGround

        if (rules !== undefined) {
            if (rules.includePosition) {
                payload.x = player.x
                payload.y = player.y
            }
            if (rules.includeVelocity) {
                payload.xVel = player.xVel
                payload.yVel = player.yVel
            }
        }

        return payload
    }
}
