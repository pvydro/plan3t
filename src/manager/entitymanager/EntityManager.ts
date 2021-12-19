import { EntitySchema } from '../../network/schema/EntitySchema'
import { ClientEntity } from '../../cliententity/ClientEntity'
import { log, VerboseLogging } from '../../service/Flogger'
import { GravityManager, IGravityManager } from '../GravityManager'
import { EntityPlayerCreator, IEntityPlayerCreator } from './EntityPlayerCreator'
import { EntitySynchronizer, IEntitySynchronizer } from '../../synchronizer/EntitySynchronizer'
import { EntityProjectileCreator, IEntityProjectileCreator } from './EntityProjectileCreator'
import { EntityCreatureCreator, IEntityCreatureCreator } from './EntityCreatureCreator'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { EnemyManager, IEnemyManager } from '../enemymanager/EnemyManager'
import { CreatureSchema } from '../../network/schema/CreatureSchema'
import { PlayerSchema } from '../../network/schema/PlayerSchema'
import { ProjectileSchema } from '../../network/schema/ProjectileSchema'
import { camera } from '../../shared/Dependencies'

export interface EntityCreatorOptions {
    schema: EntitySchema
}

export interface LocalEntity {
    serverEntity?: EntitySchema
    clientEntity?: ClientEntity
}

export interface IEntityManager {
    clientEntities: Map<string, LocalEntity>
    gravityManager: IGravityManager
    enemyManager: IEnemyManager
    createPlayer(schema: PlayerSchema, sessionId: string): ClientPlayer
    // createCreature(Creature?: CreatureSchema)
    clearClientEntities(): void
    updateEntity(entity: EntitySchema, sessionId: string, changes?: any): void
    removeEntity(sessionId: string, layer?: number): void
    registerEntity(sessionId: string, localEntity: LocalEntity | ClientEntity): void
    getSchema(sessionId: string): EntitySchema
    createProjectile(schema: ProjectileSchema, entityId: string): void
}

export class EntityManager implements IEntityManager {
    clientEntities: Map<string, LocalEntity> = new Map()
    gravityManager: IGravityManager
    enemyManager: IEnemyManager
    playerCreator: IEntityPlayerCreator
    creatureCreator: IEntityCreatureCreator
    projectileCreator: IEntityProjectileCreator
    synchronizer: IEntitySynchronizer

    constructor() {
        const entityManager = this
        
        this.gravityManager = new GravityManager({ enemyManager: entityManager.enemyManager })
        this.playerCreator = new EntityPlayerCreator()
        this.creatureCreator = new EntityCreatureCreator()
        this.projectileCreator = new EntityProjectileCreator({ entityManager })
        this.synchronizer = new EntitySynchronizer({ entityManager })
        this.enemyManager = new EnemyManager()
    }

    removeEntity(sessionId: string, layer?: number) {
        const removedLocalEntity = this.clientEntities.get(sessionId)
        
        if (removedLocalEntity) {
            camera.stage.removeFromLayer(removedLocalEntity.clientEntity, layer)
            this.clientEntities.delete(sessionId)
    
            delete removedLocalEntity.clientEntity
            delete removedLocalEntity.serverEntity
        }
    }
    
    updateEntity(entity: EntitySchema, sessionId: string, changes?: any) {
        if (VerboseLogging) log('EntityManager', 'updateEntity', 'sessionId', sessionId)

        this.synchronizer.updateEntity(entity, sessionId, changes)
    }

    createCreature(schema: CreatureSchema) {
        this.creatureCreator.createCreature(schema.id, {
            schema,
            type: schema.creatureType,
        })
    }

    createProjectile(schema: ProjectileSchema, entityId: string) {
        schema.id = entityId

        this.projectileCreator.createProjectile(schema)
    }

    createPlayer(schema: PlayerSchema, entityId: string): ClientPlayer {
        schema.id = entityId
        return this.playerCreator.createPlayer(schema)
    }

    registerEntity(id: string, localEntity: LocalEntity | ClientEntity) {
        log('EntityManager', 'registerEntity', 'sessionId', id)

        localEntity = (localEntity instanceof ClientEntity)
            ? { clientEntity: localEntity } : localEntity
        const serverEntity = localEntity.serverEntity

        if (serverEntity) {
            serverEntity.onChange = (changes: any) => this.updateEntity(serverEntity, id, changes)
        }

        this.clientEntities.set(id, localEntity)

        camera.addDebugEntity(localEntity.clientEntity)
    }

    clearClientEntities() {
        log('EntityManager', 'clearClientEntities')

        this.playerCreator.clearRegisteredPlayer()
        this.clientEntities.clear()
    }

    getSchema(id: string): EntitySchema {
        return this.clientEntities[id].serverEntity
    }
}
