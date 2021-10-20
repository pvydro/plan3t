import { ClientPlayer } from '../ClientPlayer'
import { ClientPlayerState } from '../ClientPlayerState'
import { PlayerStatePack } from './PlayerStatePack'

export interface PlayerPackRules {
    includePosition?: boolean
    includeVelocity?: boolean
}

export class PlayerStateFormatter {
    private constructor() {}

    static convertPlayerToPack(player: ClientPlayerState, rules?: PlayerPackRules): PlayerStatePack {
        const payload: PlayerStatePack | any = {}

        payload.direction = player.direction as number
        payload.walkingDirection = player.walkingDirection as number
        payload.bodyState = player.bodyState as number
        payload.legsState = player.legsState as number
        payload.isOnGround = player.isOnGround
        payload.x = player.x
        payload.y = player.y
        payload.xVel = player.xVel
        payload.yVel = player.yVel

        if (rules !== undefined) {
            // if (rules.includePosition) {
            //     payload.x = player.x
            //     payload.y = player.y
            // }
            if (rules.includeVelocity) {
                payload.xVel = player.xVel
                payload.yVel = player.yVel
            }
        }

        return payload
    }
}
