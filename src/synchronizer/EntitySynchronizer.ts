import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { Direction } from '../engine/math/Direction'
import { IUpdatable } from '../interface/IUpdatable'
import { EntitySchema } from '../network/schema/EntitySchema'
import { PlayerSchema } from '../network/schema/PlayerSchema'
import { PlayerBodyState, PlayerLegsState } from '../network/utils/Enum'
import { log, VerboseLogging } from '../service/Flogger'
import { RoomManager } from '../manager/roommanager/RoomManager'
import { IEntityManager } from '../manager/entitymanager/EntityManager'
import { EntitySynchronizerAssertionService, IEntitySynchronizerAssertionService } from './EntitySynchronizerAssertionService'
import { exists } from '../utils/Utils'
import { WeaponName } from '../weapon/WeaponName'
import { CreatureSchema } from '../network/schema/CreatureSchema'

export interface IEntitySynchronizer extends IUpdatable {
    assertionService: IEntitySynchronizerAssertionService
    updateEntity(entity: EntitySchema, sessionId: string, changes?: any)
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

    updateEntity(schema: EntitySchema, sessionId: string, changes?: any) {
        log('EntitySynchronizer', 'updateEntity', 'sessionId', sessionId, VerboseLogging ? 'changes: ' + JSON.stringify(changes) : null)

        const clientEntity = this.clientEntities.get(sessionId).clientEntity    

        clientEntity.x = schema.x

        // // TODO: Deprecate synchronizables system
        // // this.assertionService.applyChangesToSynchronizable(sessionId, entity)

        // const isClientPlayer: boolean = RoomManager.isSessionALocalPlayer(sessionId)
        // const isPlayer: boolean = (entity instanceof PlayerSchema)
        // const isCreature: boolean = (entity instanceof CreatureSchema)
        
        // if (!isClientPlayer) {
        //     const serverEntity = this.clientEntities.get(sessionId).serverEntity

        //     if (isPlayer) {
        //         this.updatePlayer(serverEntity as PlayerSchema, sessionId, changes)
        //     }
        // }

        // if (isCreature) {
        //     // const client = this.clientEntities.get(sessionId).clientEntity
        // }
    }

    // private updatePlayer(player: PlayerSchema, sessionId: string, changes?: any) {
    //     log('EntitySynchronizer', 'updatePlayer', 'sessionId', sessionId)

    //     if (RoomManager.isSessionALocalPlayer(sessionId)) return
        
    //     this.assertionService.playerAssertionService.applyChangesToSynchronizablePlayer(sessionId, player)

    //     const localEntity = this.clientEntities.get(sessionId)

    //     if (!exists(localEntity)) return

    //     const clientPlayer = localEntity.clientEntity as ClientPlayer
    //     const playerState = this.roomState.players.get(sessionId)

    //     clientPlayer.direction = playerState.direction as Direction
    //     clientPlayer.walkingDirection = playerState.walkingDirection as Direction
    //     clientPlayer.bodyState = playerState.bodyState as PlayerBodyState
    //     clientPlayer.legsState = playerState.legsState as PlayerLegsState
    //     clientPlayer.x = playerState.x
        
    //     // if (clientPlayer.holster.currentWeapon.name
    //     // && clientPlayer.holster.currentWeapon.name !== playerState.weaponStatus.name) {
    //     //     clientPlayer.holster.setCurrentWeapon(playerState.weaponStatus.name as WeaponName)
    //     // }
    //     if (player.weaponStatus.name && player.weaponStatus.name !== clientPlayer.holster.currentWeapon.name) {
    //         clientPlayer.holster.setCurrentWeapon(playerState.weaponStatus.name as WeaponName)
    //     }
    // }

    get clientEntities() {
        return this.entityManager.clientEntities
    }

    get roomState() {
        return this.entityManager.roomState
    }
}
