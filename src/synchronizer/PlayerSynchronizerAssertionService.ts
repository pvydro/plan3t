import { IClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../interface/IUpdatable'
import { RoomManager } from '../manager/roommanager/RoomManager'
import { Flogger } from '../service/Flogger'
import { EntitySynchronizerAssertionService } from './EntitySynchronizerAssertionService'
import { PlayerSynchronizerDebugger } from './PlayerSynchronizerDebugger'

export interface IPlayerSynchronizerAssertionService extends IUpdatable {
    clientPlayer: IClientPlayer | undefined
}

export interface PlayerSynchronizerAssertionServiceOptions {
    assertionService: EntitySynchronizerAssertionService
}

export class PlayerSynchronizerAssertionService implements IPlayerSynchronizerAssertionService {
    _clientPlayer?: IClientPlayer
    debugger: PlayerSynchronizerDebugger
    assertionService: EntitySynchronizerAssertionService

    constructor(options: PlayerSynchronizerAssertionServiceOptions) {
        this.assertionService = options.assertionService

        this.debugger = new PlayerSynchronizerDebugger({ synchronizer: this })
    }

    update() {
        if (this.clientPlayer !== undefined) {
            this.debugger.update()
        }
    }

    startListeningForChanges() {
        Flogger.log('PlayerSynchronizerAssertionService', 'startListeningForChanges')

        // this.roomState.players.forEach(() => {

        // })

        // this.roomState.players.get(this.clientSessionId).onChange = (changes: any) => {
        //     console.log('%cPlayerChange', 'background-color: navy; color: red;')
        //     console.log(changes)
        // }
    }

    set clientPlayer(value: IClientPlayer) {
        this._clientPlayer = value

        this.startListeningForChanges()
    }

    get clientPlayer() {
        return this._clientPlayer
    }

    get clientSessionId() {
        return RoomManager._room.sessionId
    }

    get roomState() {
        return this.assertionService.roomState
    }

    get clientEntities() {
        return this.assertionService.clientEntities
    }
}
