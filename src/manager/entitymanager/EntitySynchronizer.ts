import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { Direction } from '../../engine/math/Direction'
import { Entity } from '../../network/rooms/Entity'
import { Player } from '../../network/rooms/Player'
import { PlayerBodyState, PlayerLegsState } from '../../network/utils/Enum'
import { Flogger } from '../../service/Flogger'
import { RoomManager } from '../roommanager/RoomManager'
import { IEntityManager } from './EntityManager'

export interface IEntitySynchronizer {
    updateEntity(entity: Entity, sessionId: string, changes?: any)
}

export interface EntitySynchronizerOptions {
    entityManager: IEntityManager
}

export class EntitySynchronizer implements IEntitySynchronizer {
    entityManager: IEntityManager

    constructor(options: EntitySynchronizerOptions) {
        this.entityManager = options.entityManager
    }

    updateEntity(entity: Entity, sessionId: string, changes?: any) {
        Flogger.log('EntityManager', 'updateEntity', 'sessionId', sessionId)

        const isLocalPlayer = RoomManager.isSessionALocalPlayer(sessionId)
        const isPlayer = (entity as Player) !== undefined
        
        if (!isLocalPlayer) {
            const clientEntity = this.clientEntities[sessionId]

            if (isPlayer) {
                this.updatePlayer(clientEntity as Player, sessionId, changes)
            }
        }
    }

    private updatePlayer(player: Player, sessionId: string, changes?: any) {
        if (RoomManager.isSessionALocalPlayer(sessionId)) return
        
        const clientPlayer = this.clientEntities.get(sessionId).clientEntity as ClientPlayer
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
