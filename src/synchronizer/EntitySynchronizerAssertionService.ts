import { IClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../interface/IUpdatable'
import { Entity } from '../network/rooms/Entity'
import { Flogger } from '../service/Flogger'
import { EntitySynchronizer } from './EntitySynchronizer'
import { IPlayerSynchronizerAssertionService, PlayerSynchronizerAssertionService } from './PlayerSynchronizerAssertionService'
import { exists } from '../utils/Utils'
import { PlanetGameState } from '../network/schema/planetgamestate/PlanetGameState'
import { LocalEntity } from '../manager/entitymanager/EntityManager'

export interface IEntitySynchronizerAssertionService extends IUpdatable {
    synchronizables: Map<string, Entity>
    clientPlayer: IClientPlayer
    roomState: PlanetGameState
    clientEntities: Map<string, LocalEntity>
    applyChangesToSynchronizable(sessionId: string, entity: Entity): void
}

export interface EntitySynchronizerAssertionServiceOptions {
    synchronizer: EntitySynchronizer
}

export class EntitySynchronizerAssertionService implements IEntitySynchronizerAssertionService {
    synchronizables: Map<string, Entity> = new Map()

    entitySynchronizer: EntitySynchronizer
    _numberOfTimesAsserted: number = 0
    _currentAssertionFrameInterval: number = 100
    assertionFrameInterval: number = 100
    enableLoopingAssertion: boolean = false

    playerAssertionService: IPlayerSynchronizerAssertionService

    constructor(options: EntitySynchronizerAssertionServiceOptions) {
        const assertionService = this

        this.entitySynchronizer = options.synchronizer

        this.playerAssertionService = new PlayerSynchronizerAssertionService({ assertionService })
    }

    update() {
        this.playerAssertionService.update()
    }

    applyChangesToSynchronizable(sessionId: string, entity: Entity) {
        Flogger.log('EntitySynchronizerAssertionService', 'applyChangesToSynchronizable')

        if (this.synchronizables.has(sessionId)) {
            const synchEntity = this.synchronizables.get(sessionId)

            // Position
            if (exists(entity.x) && entity.x !== synchEntity.x) {
                synchEntity.x = entity.x
            }
            if (exists(entity.y) && entity.y !== synchEntity.y) {
                synchEntity.y = entity.y
            }

        } else {
            Flogger.color('green')
            Flogger.log('EntitySynchronizerAssertionService', 'Setting new synchronizable', 'sessionId', sessionId)
            
            this.synchronizables.set(sessionId, entity)
        }
    }

    set clientPlayer(value: IClientPlayer) {
        this.playerAssertionService.clientPlayer = value
    }

    get clientPlayer() {
        return this.playerAssertionService.clientPlayer
    }

    // assertEntities() {
    //     if (this._numberOfTimesAsserted % 5 === 0) {
    //         Flogger.log('EntitySynchronizerAssertionService', 'assertEntities', 'x5', 'numberOfTimesAsserted', this._numberOfTimesAsserted)
    //     }
    //     this._numberOfTimesAsserted++

    //     this.assertPlayer()
    // }

    // private assertPlayer() {
    //     Flogger.log('EntitySynchronizerAssertionService', 'assertPlayers')

    //     const room = RoomManager._room

    //     if (room !== undefined) {
    //         const localSessionId = room.sessionId
    //         const localPlayerServerInstance = this.roomState.players.get(localSessionId)

    //         console.log(localPlayerServerInstance)
    //     }

    //     // const localEntity = this.clientEntities.get(sessionId)
    //     this.roomState.players.forEach((player: Player, sessionId: string) => {
    //         Flogger.log('EntitySynchronizerAssertionService', 'asserting: ' + sessionId, 'player', player)

    //         const localPlayer = this.entitySynchronizer.clientEntities.get(sessionId).clientEntity

    //         // TODO Interpolate this
    //         localPlayer.x = player.x
    //         // player.x
    //     })
    // }

    get roomState() {
        return this.entitySynchronizer.roomState
    }

    get clientEntities() {
        return this.entitySynchronizer.clientEntities
    }

}
