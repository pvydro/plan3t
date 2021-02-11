import { RoomManager } from '../manager/roommanager/RoomManager'
import { Player } from '../network/rooms/Player'
import { Flogger } from '../service/Flogger'
import { EntitySynchronizer } from './EntitySynchronizer'

export interface IEntitySynchronizerAssertionService {
    startLoopingAssertion(): void
    update(): void
    assertEntities(): void
}

export interface EntitySynchronizerAssertionServiceOptions {
    synchronizer: EntitySynchronizer
}

export class EntitySynchronizerAssertionService implements IEntitySynchronizerAssertionService {
    entitySynchronizer: EntitySynchronizer
    _numberOfTimesAsserted: number = 0
    _currentAssertionFrameInterval: number = 100
    assertionFrameInterval: number = 100
    enableLoopingAssertion: boolean = false

    constructor(options: EntitySynchronizerAssertionServiceOptions) {
        this.entitySynchronizer = options.synchronizer
    }

    startLoopingAssertion() {
        Flogger.log('EntitySynchronizerAssertionService', 'startLoopingAssertion', 'already startedLoopAssertion', this.enableLoopingAssertion)

        if (this.enableLoopingAssertion) return

        this.enableLoopingAssertion = true
    }

    stopLoopingAssertion() {
        Flogger.log('EntitySynchronizerAssertionService', 'startLoopingAssertion', 'startedLoopAssertion', this.enableLoopingAssertion)

        if (!this.enableLoopingAssertion) return

        this.enableLoopingAssertion = false
    }

    update() {
        if (this.enableLoopingAssertion) {
            this._currentAssertionFrameInterval--
    
            if (this._currentAssertionFrameInterval <= 0) {
                this._currentAssertionFrameInterval = this.assertionFrameInterval
    
                this.assertEntities()
            }
        }
    }

    assertEntities() {
        if (this._numberOfTimesAsserted % 5 === 0) {
            Flogger.log('EntitySynchronizerAssertionService', 'assertEntities', 'x5', 'numberOfTimesAsserted', this._numberOfTimesAsserted)
        }
        this._numberOfTimesAsserted++

        this.assertPlayer()
    }

    private assertPlayer() {
        Flogger.log('EntitySynchronizerAssertionService', 'assertPlayers')

        const room = RoomManager._room

        if (room !== undefined) {
            const localSessionId = room.sessionId
            const localPlayerServerInstance = this.roomState.players.get(localSessionId)

            console.log(localPlayerServerInstance)
        }

        // const localEntity = this.clientEntities.get(sessionId)
        this.roomState.players.forEach((player: Player, sessionId: string) => {
            Flogger.log('EntitySynchronizerAssertionService', 'asserting: ' + sessionId, 'player', player)

            const localPlayer = this.entitySynchronizer.clientEntities.get(sessionId).clientEntity

            // TODO Interpolate this
            localPlayer.x = player.x
            // player.x
        })
    }

    get sessionId() {
        return this.entitySynchronizer.entityManager.roomState
    }

    get roomState() {
        return this.entitySynchronizer.roomState
    }

    get clientEntities() {
        return this.entitySynchronizer.clientEntities
    }

}
