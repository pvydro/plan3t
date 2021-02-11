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
        Flogger.log('EntityManager', 'updateEntity', 'sessionId', sessionId)
        console.log(changes)

        const isLocalPlayer = RoomManager.isSessionALocalPlayer(sessionId)
        const isPlayer = (entity as Player) !== undefined
        
        if (!isLocalPlayer) {
            const serverEntity = this.clientEntities.get(sessionId).serverEntity

            if (isPlayer) {
                this.updatePlayer(serverEntity as Player, sessionId, changes)
            }
        }
    }

    private updatePlayer(player: Player, sessionId: string, changes?: any) {
        Flogger.log('EntityManager', 'updatePlayer', 'sessionId', sessionId)

        if (RoomManager.isSessionALocalPlayer(sessionId)) return
        
        const localEntity = this.clientEntities.get(sessionId)

        if (!localEntity) return

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
