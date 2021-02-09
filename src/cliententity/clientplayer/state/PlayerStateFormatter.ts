import { ClientPlayer } from "../ClientPlayer";
import { PlayerStatePack } from "./PlayerStatePack";

export class PlayerStateFormatter {
    private constructor() {}

    static convertPlayerToPack(player: ClientPlayer): PlayerStatePack {
        const direction = player.direction as number
        const bodyState = player.bodyState as number
        const legsState = player.legsState as number
        const x = player.x
        const y = player.y
        const xVel = player.xVel
        const yVel = player.yVel

        return {
            x, y,
            xVel, yVel,
            direction,
            bodyState,
            legsState,
        }
    }
}
