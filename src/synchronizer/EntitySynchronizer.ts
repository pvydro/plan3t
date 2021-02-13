import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { Direction } from '../engine/math/Direction'
import { IUpdatable } from '../interface/IUpdatable'
import { Entity } from '../network/rooms/Entity'
import { Player } from '../network/rooms/Player'
import { PlayerBodyState, PlayerLegsState } from '../network/utils/Enum'
import { Flogger } from '../service/Flogger'
import { RoomManager } from '../manager/roommanager/RoomManager'
import { IEntityManager } from '../manager/entitymanager/EntityManager'
import { EntitySynchronizerAssertionService, IEntitySynchronizerAssertionService } from './EntitySynchronizerAssertionService'
import { exists } from '../utils/Utils'

export interface IEntitySynchronizer extends IUpdatable {
    assertionService: IEntitySynchronizerAssertionService
    updateEntity(entity: Entity, sessionId: string, changes?: any)
}

export interface EntitySynchronizerOptions {
    entityManager: IEntityManager
}

export class EntitySynchronizer implements IEntitySynchronizer {
    entityManager: IEntityManager
    assertionService: IEntitySynchronizerAssertionService

    constructor(options: EntitySynchronizerOptions) {
        const synchronizer = this

        this.entityManager = options.entityManager
        this.assertionService = new EntitySynchronizerAssertionService({ synchronizer })
    }

    update() {
        this.assertionService.update()
    }

    updateEntity(entity: Entity, sessionId: string, changes?: any) {
        Flogger.log('EntitySynchronizer', 'updateEntity', 'sessionId', sessionId)

        this.assertionService.applyChangesToSynchronizable(sessionId, entity)

        const isClientPlayer: boolean = RoomManager.isSessionALocalPlayer(sessionId)
        const isPlayer: boolean = (entity as Player) !== undefined
        
        if (!isClientPlayer) {
            const serverEntity = this.clientEntities.get(sessionId).serverEntity

            if (isPlayer) {
                this.updatePlayer(serverEntity as Player, sessionId, changes)
            }
        }
    }

    private updatePlayer(player: Player, sessionId: string, changes?: any) {
        Flogger.log('EntitySynchronizer', 'updatePlayer', 'sessionId', sessionId)

        if (RoomManager.isSessionALocalPlayer(sessionId)) return
        
        this.assertionService.playerAssertionService.applyChangesToSynchronizablePlayer(sessionId, player)

        const localEntity = this.clientEntities.get(sessionId)

        if (!exists(localEntity)) return

        const clientPlayer = localEntity.clientEntity as ClientPlayer
        const playerState = this.roomState.players.get(sessionId)

        clientPlayer.direction = playerState.direction as Direction
        clientPlayer.walkingDirection = playerState.walkingDirection as Direction
        clientPlayer.bodyState = playerState.bodyState as PlayerBodyState
        clientPlayer.legsState = playerState.legsState as PlayerLegsState
    }

    get clientEntities() {
        return this.entityManager.clientEntities
    }

    get roomState() {
        return this.entityManager.roomState
    }
}
