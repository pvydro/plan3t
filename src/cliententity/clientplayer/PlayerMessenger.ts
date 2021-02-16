import { IUpdatable } from '../../interface/IUpdatable'
import { RoomMessenger } from '../../manager/roommanager/RoomMessenger'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { Flogger } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'
import { Weapon } from '../../weapon/Weapon'
import { ClientPlayer } from './ClientPlayer'
import { PlayerPackRules, PlayerStateFormatter } from './state/PlayerStateFormatter'
import { WeaponStateFormatter } from './state/WeaponStateFormatter'
import { WeaponStatePack } from './state/WeaponStatePack'

export interface IPlayerMessenger extends IUpdatable {
    startSendingWeaponStatus(): void
    send(endpoint: string, rules?: PlayerPackRules): void
    sendShoot(weapon: Weapon): void
}

export interface PlayerMessengerOptions {
    player: ClientPlayer
}

export class PlayerMessenger implements IPlayerMessenger {
    _lastSentWeaponRotation: number = 0
    _isRefreshingWeapon: boolean = false
    weaponRefreshRate: number = 25
    weaponRefreshInterval: number = this.weaponRefreshRate
    player: ClientPlayer

    constructor(options: PlayerMessengerOptions) {
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
        if (DebugConstants.ShowPlayerMessengerLogs) Flogger.log('PlayerMessenger', 'endpoint', endpoint)

        if (!this.player.isClientPlayer) return

        RoomMessenger.send(endpoint, this.getPlayerPayload(rules))
    }

    getPlayerPayload(rules?: PlayerPackRules) {
        return PlayerStateFormatter.convertPlayerToPack(this.player, rules)
    }

    startSendingWeaponStatus() {
        if (this._isRefreshingWeapon) return

        this._isRefreshingWeapon = true
    }

    sendShoot(weapon: Weapon) {
        const pack = WeaponStateFormatter.convertWeaponToPack(weapon)
        
        if (DebugConstants.ShowPlayerMessengerLogs) Flogger.log('PlayerMessenger', 'sendShoot', 'RoomMessage.PlayerShoot', 'pack', pack)

        RoomMessenger.send(RoomMessage.PlayerShoot, pack)
    }

    private sendWeaponStatus() {
        if (DebugConstants.ShowPlayerMessengerLogs) Flogger.log('PlayerMessenger', 'sendWeaponStatus')

        const rotation = this.player.hand.rotation
        const pack: WeaponStatePack = { rotation }

        if (rotation !== this._lastSentWeaponRotation) {
            RoomMessenger.send(RoomMessage.PlayerLookAngleChanged, pack)

            this._lastSentWeaponRotation = rotation
        }

        // TODO onSpawn sendWeaponLoadout WeaponHolster .toPayloadFormat(),
        // TODO Send player hand payload
    }
}
