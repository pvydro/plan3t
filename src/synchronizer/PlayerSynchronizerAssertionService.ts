import { IClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../interface/IUpdatable'
import { RoomManager } from '../manager/roommanager/RoomManager'
import { Flogger } from '../service/Flogger'
import { EntitySynchronizerAssertionService, IEntitySynchronizerAssertionService } from './EntitySynchronizerAssertionService'
import { PlayerSynchronizerAssertionServiceDebugger } from './PlayerSynchronizerDebugger'

export interface IPlayerSynchronizerAssertionService extends IUpdatable {
    clientPlayer: IClientPlayer | undefined
    entityAssertionService: IEntitySynchronizerAssertionService
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
