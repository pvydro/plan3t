import { RoomMessager } from '../../manager/roommanager/RoomMessager'
import { Flogger } from '../../service/Flogger'
import { ClientPlayer } from './ClientPlayer'
import { PlayerPackRules, PlayerStateFormatter } from './state/PlayerStateFormatter'

export interface IPlayerMessager {
    send(endpoint: string, rules?: PlayerPackRules): void
}

export interface PlayerMessagerOptions {
    player: ClientPlayer
}

export class PlayerMessager implements IPlayerMessager {
    player: ClientPlayer

    constructor(options: PlayerMessagerOptions) {
        this.player = options.player
    }

    send(endpoint: string, rules?: PlayerPackRules) {
        Flogger.log('PlayerMessager', 'endpoint', endpoint)

        RoomMessager.send(endpoint, this.getPlayerPayload(rules))
    }

    getPlayerPayload(rules?: PlayerPackRules) {
        return PlayerStateFormatter.convertPlayerToPack(this.player, rules)
    }
}
