import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { log } from '../../service/Flogger'

export class SpawnPointManager {
    private constructor() {

    }

    static applySpawnPointsToPlayers() {
        log('SpawnPointManager', 'applySpawnPointsToPlayers')

        const players = [
            ClientPlayer.getInstance()
        ]

        players.forEach((player: IClientPlayer) => {
            const newPos = this.getPlayerSpawnPoint(player)

            player.pos = newPos
        })
    }

    static getPlayerSpawnPoint(player: IClientPlayer) {
        const x = 124
        const y = player.y

        return { x, y }
    }

    static getEnemySpawnPoint() {
        const minimumX = 12
        const maximumX = 120

        const x = minimumX + (Math.random() * (maximumX - minimumX))
        const y = -24

        return { x, y }
    }
}
