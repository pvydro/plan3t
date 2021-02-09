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
    _isRefreshingWeapon: boolean = false
    _weaponRefreshRate: number = 100
    _weaponRefreshInterval?: any
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

    beginSendingWeaponUpdateEvents() {
        Flogger.log('PlayerMessager', 'beginSendingWeaponUpdateEvents')

        if (this._isRefreshingWeapon === true) return

        this._isRefreshingWeapon = true

        this._weaponRefreshInterval = setInterval(() => {

        }, this._weaponRefreshRate)
    }

    private sendWeaponStatus() {
        Flogger.log('PlayerMessager', 'sendWeaponStatus')

        throw new Error('method now implemented')

        // TODO onSpawn sendWeaponLoadout WeaponHolster .toPayloadFormat(),
        // TODO Send player hand payload
    }
}
