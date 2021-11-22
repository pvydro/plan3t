import { EntitySchema } from '../../network/schema/EntitySchema'
import { ClientEntity } from '../../cliententity/ClientEntity'
import { Flogger, importantLog, log, VerboseLogging } from '../../service/Flogger'
import { GravityManager, IGravityManager } from '../GravityManager'
import { Game } from '../../main/Game'
import { EntityPlayerCreator, IEntityPlayerCreator } from './EntityPlayerCreator'
import { EntitySynchronizer, IEntitySynchronizer } from '../../synchronizer/EntitySynchronizer'
import { EntityProjectileCreator, IEntityProjectileCreator } from './EntityProjectileCreator'
import { EntityCreatureCreator, IEntityCreatureCreator } from './EntityCreatureCreator'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { EnemyManager, IEnemyManager } from '../enemymanager/EnemyManager'
import { CameraLayer } from '../../camera/CameraStage'
import { CreatureSchema } from '../../network/schema/CreatureSchema'
import { PlayerSchema } from '../../network/schema/PlayerSchema'
import { ProjectileSchema } from '../../network/schema/ProjectileSchema'
import { camera, entityMan } from '../../shared/Dependencies'
import { Environment } from '../../main/Environment'

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
    // createClientPlayer(schema?: PlayerSchema, sessionId?: string): ClientPlayer
    // createCoPlayer(schema: PlayerSchema, sessionId: string): ClientPlayer
    // createOfflinePlayer(): ClientPlayer
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
    private static Instance: IEntityManager
    _clientEntities: Map<string, LocalEntity> = new Map()

    gravityManager: IGravityManager
    enemyManager: IEnemyManager
    playerCreator: IEntityPlayerCreator
    creatureCreator: IEntityCreatureCreator
    projectileCreator: IEntityProjectileCreator
    synchronizer: IEntitySynchronizer

    constructor() {
        const entityManager = this
        
        this.gravityManager = new GravityManager({ enemyManager: entityManager.enemyManager })
        this.playerCreator = new EntityPlayerCreator({ entityManager })
        this.creatureCreator = new EntityCreatureCreator()
        this.projectileCreator = new EntityProjectileCreator({ entityManager })
        this.synchronizer = new EntitySynchronizer({ entityManager })
        this.enemyManager = new EnemyManager()
    }

    removeEntity(sessionId: string, layer?: number) {
        const removedLocalEntity = this._clientEntities.get(sessionId)
        
        if (removedLocalEntity) {
            this.cameraStage.removeFromLayer(removedLocalEntity.clientEntity, layer)
            this._clientEntities.delete(sessionId)
    
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
        // schema.onChange = (changes: any) => this.updateEntity(schema, entityId, changes)

        this.projectileCreator.createProjectile(schema)
    }

    createPlayer(schema: PlayerSchema, entityId: string): ClientPlayer {
        schema.id = entityId
        return this.playerCreator.createPlayer(schema)
    }

    // createOfflinePlayer() {
    //     log('EntityManager', 'createOfflinePlayer')

    //     const player = this.playerCreator.createPlayer(new PlayerSchema().assign({
    //         id: Environment.sessionId
    //     }))

    //     // entityMan.registerEntity(player.sessionId, player)
        

    //     return player
    // }

    registerEntity(id: string, localEntity: LocalEntity | ClientEntity) {
        log('EntityManager', 'registerEntity', 'sessionId', id)

        localEntity = (localEntity instanceof ClientEntity)
            ? { clientEntity: localEntity } : localEntity
        const serverEntity = localEntity.serverEntity

        if (serverEntity) {
            serverEntity.onChange = (changes: any) => this.updateEntity(serverEntity, id, changes)
        }

        this._clientEntities.set(id, localEntity)

        camera.addDebugEntity(localEntity.clientEntity)
        // let loc: LocalEntity = localEntity as LocalEntity

        // if (localEntity instanceof ClientEntity) {
        //     loc = { clientEntity: localEntity }
        // }

        // if (loc.serverEntity) {
        //     loc.serverEntity.onChange = (changes: any) => this.updateEntity(loc.serverEntity, id, changes)
        // }

        // camera.addDebugEntity(loc.clientEntity)
    }

    clearClientEntities() {
        log('EntityManager', 'clearClientEntities')

        this.playerCreator.clearRegisteredPlayer()
        this._clientEntities.clear()
    }

    getSchema(id: string): EntitySchema {
        return this._clientEntities[id]
    }

    get cameraViewport() {
        return camera.viewport
    }

    get cameraStage() {
        return camera.stage
    }

    get clientEntities() {
        return this._clientEntities
    }
}



    // createOfflinePlayer() {
    //     log('EntityManager', 'createOfflinePlayer')

    //     const player = this.playerCreator.createPlayer('offlineplayer', {
    //         schema: new PlayerSchema(),
    //         isClientPlayer: true,
    //         isOfflinePlayer: true
    //     })

    //     return player
    // }

    // createClientPlayer(schema: PlayerSchema, sessionId?: string) {
    //     log('EntityManager', 'createClientPlayer', 'sessionId', sessionId)

    //     const player = this.playerCreator.createPlayer(sessionId, { schema: schema, isClientPlayer: true })
    //     this.cameraStage.addChildAtLayer(player, CameraLayer.Players)

    //     return player
    // }

    // createCoPlayer(schema: EntitySchema, sessionId: string) {
    //     log('EntityManager', 'createCoPlayer', 'sessionId', sessionId)

    //     const player = this.playerCreator.createPlayer(sessionId, { schema: schema, isClientPlayer: false })
    //     this.cameraStage.addChildAtLayer(player, CameraLayer.Players)

    //     return player
    // }

    // createProjectile(schema: ProjectileSchema): void {
    //     log('EntityManager', 'createProjectile', 'schema', schema)

    //     this.projectileCreator.createProjectile(schema)
    // }