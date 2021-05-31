import { Camera } from '../../camera/Camera'
import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IVector2 } from '../../engine/math/Vector2'
import { log } from '../../service/Flogger'

export interface IWaveSpawnPointManager {
    getPlayerSpawnPoint(player: IClientPlayer): IVector2
    applySpawnPointsToPlayers(): void
}

export class WaveSpawnPointManager implements IWaveSpawnPointManager {
    constructor() {

    }

    applySpawnPointsToPlayers() {
        log('WaveSpawnPointManager', 'applySpawnPointsToPlayers')

        const players = [
            ClientPlayer.getInstance()
        ]

        players.forEach((player: IClientPlayer) => {
            const newPos = this.getPlayerSpawnPoint(player)

            player.pos = newPos
        })

        Camera.getInstance().snapToTarget()
    }

    getPlayerSpawnPoint(player: IClientPlayer) {
        const x = 124
        const y = player.y

        return { x, y }
    }
}
