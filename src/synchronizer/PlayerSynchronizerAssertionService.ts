import { ClientPlayer, IClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { PlayerMessenger } from '../cliententity/clientplayer/PlayerMessenger'
import { IUpdatable } from '../interface/IUpdatable'
import { RoomManager } from '../manager/roommanager/RoomManager'
import { Player } from '../network/rooms/Player'
import { Flogger, VerboseLogging } from '../service/Flogger'
import { WeaponName } from '../weapon/WeaponName'
import { EntitySynchronizerAssertionService, IEntitySynchronizerAssertionService } from './EntitySynchronizerAssertionService'
import { PlayerSynchronizerAssertionServiceDebugger } from './PlayerSynchronizerDebugger'

export interface IPlayerSynchronizerAssertionService extends IUpdatable {
    clientPlayer: IClientPlayer | undefined
    entityAssertionService: IEntitySynchronizerAssertionService
    applyChangesToSynchronizablePlayer(sessionId: string, player: Player)
}

export interface PlayerSynchronizerAssertionServiceOptions {
    assertionService: EntitySynchronizerAssertionService
}

export class PlayerSynchronizerAssertionService implements IPlayerSynchronizerAssertionService {
    _clientPlayer?: IClientPlayer
    debugger: PlayerSynchronizerAssertionServiceDebugger
    entityAssertionService: IEntitySynchronizerAssertionService

    constructor(options: PlayerSynchronizerAssertionServiceOptions) {
        this.entityAssertionService = options.assertionService

        this.debugger = new PlayerSynchronizerAssertionServiceDebugger({ assertionService: this })
    }

    update() {
        if (this.clientPlayer !== undefined) {
            this.debugger.update()
        }
    }

    applyChangesToSynchronizablePlayer(sessionId: string, player: Player) {
        Flogger.log('PlayerSynchronizerService', 'applyChangesToSynchronizablePlayer', 'sessionId', sessionId, (VerboseLogging ? 'player: ' + JSON.stringify(player) : null))
        
        if (player.weaponStatus !== undefined) {
            const rotation = player.weaponStatus.rotation
            const clientEntity = this.entityAssertionService.entitySynchronizer.clientEntities.get(sessionId).clientEntity as ClientPlayer

            if (player.weaponStatus.name && clientEntity.holster.currentWeapon.name !== player.weaponStatus.name) {
                clientEntity.holster.setCurrentWeapon(player.weaponStatus.name as WeaponName)
            }

            if (clientEntity.hand) {
                clientEntity.hand.setTargetRotation(rotation)
            }
        }
    }

    set clientPlayer(value: IClientPlayer) {
        this._clientPlayer = value
    }

    get clientPlayer() {
        return this._clientPlayer
    }

    get clientSessionId() {
        return RoomManager.clientSessionId
    }

    get roomState() {
        return this.entityAssertionService.roomState
    }

    get clientEntities() {
        return this.entityAssertionService.clientEntities
    }
}
