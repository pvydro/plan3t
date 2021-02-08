import { ClientPlayer } from "../ClientPlayer";
import { PlayerStatePack } from "./PlayerStatePack";

export class PlayerStateFormatter {
    private constructor() {}

    convertPlayerToPack(player: ClientPlayer): PlayerStatePack {
        const direction = player.direction
        const bodyState = player.bodyState
        const legsState = player.legsState
        const x = player.x
        const y = player.y
        const xVel = player.xVel
        const yVel = player.yVel

        return {
            x,
            y,
            xVel,
            yVel,
            direction,
            bodyState,
            legsState
        }
    }
}
