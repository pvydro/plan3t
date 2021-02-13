import { IUpdatable } from '../../interface/IUpdatable'
import { RoomMessager } from '../../manager/roommanager/RoomMessager'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { Flogger } from '../../service/Flogger'
import { ClientPlayer } from './ClientPlayer'
import { PlayerPackRules, PlayerStateFormatter } from './state/PlayerStateFormatter'
import { WeaponStatePack } from './state/WeaponStatePack'

export interface IPlayerMessager extends IUpdatable {
    startSendingWeaponStatus(): void
    send(endpoint: string, rules?: PlayerPackRules): void
}

export interface PlayerMessagerOptions {
    player: ClientPlayer
}

export class PlayerMessager implements IPlayerMessager {
    _lastSentWeaponRotation: number = 0
    _isRefreshingWeapon: boolean = false
    weaponRefreshRate: number = 25
    weaponRefreshInterval: number = this.weaponRefreshRate
    player: ClientPlayer

    constructor(options: PlayerMessagerOptions) {
        this.player = options.player
    }

    update() {
        if (this._isRefreshingWeapon) {
            this.weaponRefreshInterval--
    
            if (this.weaponRefreshInterval <= 0) {
                this.weaponRefreshInterval = this.weaponRefreshRate
                this.sendWeaponStatus()
            }
        }
    }

    send(endpoint: string, rules?: PlayerPackRules) {
        Flogger.log('PlayerMessager', 'endpoint', endpoint)

        if (!this.player.isClientPlayer) return

        RoomMessager.send(endpoint, this.getPlayerPayload(rules))
    }

    getPlayerPayload(rules?: PlayerPackRules) {
        return PlayerStateFormatter.convertPlayerToPack(this.player, rules)
    }

    startSendingWeaponStatus() {
        if (this._isRefreshingWeapon) return

        this._isRefreshingWeapon = true
    }

    private sendWeaponStatus() {
        Flogger.log('PlayerMessager', 'sendWeaponStatus')

        const rotation = this.player.hand.rotation
        const pack: WeaponStatePack = { rotation }

        Flogger.log('PlayerMessager', 'sendWeaponStatus', 'rotation', rotation)

        if (rotation !== this._lastSentWeaponRotation) {
            RoomMessager.send(RoomMessage.PlayerLookAngleChanged, pack)

            this._lastSentWeaponRotation = rotation
        }

        // TODO onSpawn sendWeaponLoadout WeaponHolster .toPayloadFormat(),
        // TODO Send player hand payload
    }
}
