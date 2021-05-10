import { IClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../interface/IUpdatable'
import { Entity } from '../network/rooms/Entity'
import { Flogger, importantLog } from '../service/Flogger'
import { EntitySynchronizer } from './EntitySynchronizer'
import { IPlayerSynchronizerAssertionService, PlayerSynchronizerAssertionService } from './PlayerSynchronizerAssertionService'
import { exists } from '../utils/Utils'
import { PlanetGameState } from '../network/schema/planetgamestate/PlanetGameState'
import { LocalEntity } from '../manager/entitymanager/EntityManager'
import { Player } from '../network/rooms/Player'

export interface IEntitySynchronizerAssertionService extends IUpdatable {
    playerAssertionService: IPlayerSynchronizerAssertionService
    entitySynchronizer: EntitySynchronizer
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
        
        const entityPlayer = entity as Player
        const isPlayer = entityPlayer !== undefined
        const synchEntity = this.synchronizables.get(sessionId)
        const synchEntityPlayer = synchEntity as Player

        if (sessionId !== undefined && synchEntity !== undefined) {

            // Position
            if (exists(entity.x) && entity.x !== synchEntity.x) {
                synchEntity.x = entity.x
            }
            if (exists(entity.y) && entity.y !== synchEntity.y) {
                synchEntity.y = entity.y
            }

        } else {
            importantLog('EntitySynchronizerAssertionService', 'Setting new synchronizable', 'sessionId', sessionId)
            
            this.synchronizables.set(sessionId, entity)
        }

        //     this.roomState.players.forEach((player: Player, sessionId: string) => {
        //         const localPlayer = this.entitySynchronizer.clientEntities.get(sessionId).clientEntity
        //         localPlayer.x = player.x
        //     })
    }

    set clientPlayer(value: IClientPlayer) {
        this.playerAssertionService.clientPlayer = value
    }

    get clientPlayer() {
        return this.playerAssertionService.clientPlayer
    }

    get roomState() {
        return this.entitySynchronizer.roomState
    }

    get clientEntities() {
        return this.entitySynchronizer.clientEntities
    }

}
