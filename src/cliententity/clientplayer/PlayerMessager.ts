import { RoomMessager } from '../../manager/roommanager/RoomMessager'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { Flogger } from '../../service/Flogger'
import { ClientPlayer } from './ClientPlayer'
import { PlayerStateFormatter } from './state/PlayerStateFormatter'

export interface IPlayerMessager {
    send(endpoint: string): void
}

export interface PlayerMessagerOptions {
    player: ClientPlayer
}

export class PlayerMessager implements IPlayerMessager {
    player: ClientPlayer

    constructor(options: PlayerMessagerOptions) {
        this.player = options.player
    }

    send(endpoint: string) {
        Flogger.log('PlayerMessager', 'endpoint', endpoint)

        RoomMessager.send(endpoint, this.playerPayload)
    }

    get playerPayload() {
        return PlayerStateFormatter.convertPlayerToPack(this.player)
    }
}
