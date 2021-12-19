import { IUpdatable } from '../interface/IUpdatable'
import { EntitySchema } from '../network/schema/EntitySchema'
import { log, VerboseLogging } from '../service/Flogger'
import { IEntityManager, LocalEntity } from '../manager/entitymanager/EntityManager'

export interface IEntitySynchronizer {
    updateEntity(entity: EntitySchema, sessionId: string, changes?: any)
}

export interface EntitySynchronizerOptions {
    entityManager: IEntityManager
}

export class EntitySynchronizer implements IEntitySynchronizer {
    entityManager: IEntityManager

    constructor(options: EntitySynchronizerOptions) {
        const synchronizer = this

        this.entityManager = options.entityManager
    }

    updateEntity(schema: EntitySchema, sessionId: string, changes?: any) {
        if (VerboseLogging) log('EntitySynchronizer', 'updateEntity', 'sessionId', sessionId, `changes ${changes}`)

        const entity: LocalEntity = this.clientEntities.get(sessionId)

        if (schema.dead) {
            this.entityManager.removeEntity(sessionId)
        }

        entity.clientEntity.targetServerPosition.x = schema.x
        entity.clientEntity.targetServerPosition.y = schema.y
        entity.clientEntity.targetServerDimension.width = schema.width
        entity.clientEntity.targetServerDimension.height = schema.height
        entity.clientEntity.frozen = schema.frozen
        entity.serverEntity = schema

        if (entity.clientEntity.frozen) {
            entity.clientEntity.y = schema.y
        }

        if (entity.clientEntity.currentHealth > schema.health) {
            const totalDamage = entity.clientEntity.currentHealth - schema.health
            entity.clientEntity.takeDamage(totalDamage)
        }

        // // TODO: Deprecate synchronizables system
        // // this.assertionService.applyChangesToSynchronizable(sessionId, entity)

        // if (schema instanceof PlayerSchema
        //     && RoomManager.isSessionALocalPlayer(sessionId)) return
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

    // get roomState() {
    //     return this.entityManager.roomState
    // }
}
