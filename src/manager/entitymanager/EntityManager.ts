import { EntitySchema } from '../../network/schema/EntitySchema'
import { RoomManager } from '../roommanager/RoomManager'
import { Camera } from '../../camera/Camera'
import { ClientEntity } from '../../cliententity/ClientEntity'
import { Flogger, log } from '../../service/Flogger'
import { GravityManager, IGravityManager } from '../GravityManager'
import { Game } from '../../main/Game'
import { ProjectileType } from '../../weapon/projectile/Bullet'
import { EntityPlayerCreator, IEntityPlayerCreator } from './EntityPlayerCreator'
import { EntitySynchronizer, IEntitySynchronizer } from '../../synchronizer/EntitySynchronizer'
import { EntityProjectileCreator, IEntityProjectileCreator } from './EntityProjectileCreator'
import { IUpdatable } from '../../interface/IUpdatable'
import { EntityCreatureCreator, IEntityCreatureCreator } from './EntityCreatureCreator'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { Key } from 'ts-keycode-enum'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { EnemyManager, IEnemyManager } from '../enemymanager/EnemyManager'
import { CreatureType } from '../../creature/CreatureType'
import { CameraLayer } from '../../camera/CameraStage'
import { CreatureSchema } from '../../network/schema/CreatureSchema'
import { IVector2 } from '../../engine/math/Vector2'
import { ServerGameState } from '../../network/schema/serverstate/ServerGameState'
import { PlayerSchema } from '../../network/schema/PlayerSchema'

export interface EntityCreatorOptions {
    entity?: EntitySchema
    position?: IVector2
}

export interface LocalEntity {
    serverEntity?: EntitySchema
    clientEntity?: ClientEntity
}

export interface IEntityManager extends IUpdatable {
    clientEntities: Map<string, LocalEntity>
    camera: Camera
    roomState: ServerGameState
    gravityManager: IGravityManager
    enemyManager: IEnemyManager
    createClientPlayer(schema?: PlayerSchema, sessionId?: string): ClientPlayer
    createCoPlayer(schema: PlayerSchema, sessionId: string): ClientPlayer
    createOfflinePlayer(): ClientPlayer
    createCreature(Creature?: CreatureSchema)
    clearClientEntities(): void
    updateEntity(entity: EntitySchema, sessionId: string, changes?: any): void
    removeEntity(sessionId: string, layer?: number): void
    registerEntity(sessionId: string, localEntity: LocalEntity | ClientEntity): void
    getSchema(sessionId: string): EntitySchema
    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, bulletVelocity?: number): void
}

export interface EntityManagerOptions {
    game?: Game
}

export class EntityManager implements IEntityManager {
    private static Instance: IEntityManager
    _clientEntities: Map<string, LocalEntity> = new Map()

    game: Game
    gravityManager: IGravityManager
    enemyManager: IEnemyManager
    playerCreator: IEntityPlayerCreator
    creatureCreator: IEntityCreatureCreator
    projectileCreator: IEntityProjectileCreator
    synchronizer: IEntitySynchronizer

    static getInstance(options?: EntityManagerOptions) {
        if (!this.Instance) {
            if (options !== undefined) {
                this.Instance = new EntityManager(options)
            } else {
                Flogger.error('Tried to get new ClientManager.Instance with no options')
            }
        }

        return this.Instance
    }

    private constructor(options: EntityManagerOptions) {
        const entityManager = this

        this.game = options.game
        
        this.gravityManager = new GravityManager({ enemyManager: entityManager.enemyManager })
        this.playerCreator = new EntityPlayerCreator({ entityManager })
        this.creatureCreator = new EntityCreatureCreator({ entityManager })
        this.projectileCreator = new EntityProjectileCreator({ entityManager })
        this.synchronizer = new EntitySynchronizer({ entityManager })
        this.enemyManager = new EnemyManager({ entityManager })

        // Test key listeners
        let cid = 0
        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which == Key.C) {
                this.createPassiveCreature(`creat${cid}`)
                cid++
            }
        })
    }

    update() {
        this.synchronizer.update()
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
        log('EntityManager', 'updateEntity', 'sessionId', sessionId)

        this.synchronizer.updateEntity(entity, sessionId, changes)
    }

    createCreature(schema: CreatureSchema) {
        this.creatureCreator.createCreature(schema.id, {
            type: schema.creatureType,
            position: {
                x: schema.x,
                y: schema.y
            }
        })
    }

    createPassiveCreature(id: string) {
        log('EntityManager', 'createPassiveCreature')

        this.creatureCreator.createCreature(id, {
            type: CreatureType.Koini
        })
    }

    createOfflinePlayer() {
        log('EntityManager', 'createOfflinePlayer')

        const player = this.playerCreator.createPlayer('offlineplayer', {
            isClientPlayer: true,
            isOfflinePlayer: true
        })

        return player
    }

    createClientPlayer(schema: PlayerSchema, sessionId?: string) {
        log('EntityManager', 'createClientPlayer', 'sessionId', sessionId)

        const player = this.playerCreator.createPlayer(sessionId, {
            entity: schema,
            isClientPlayer: true
        })

        this.synchronizer.assertionService.clientPlayer = player

        return player
    }

    createCoPlayer(schema: EntitySchema, sessionId: string) {
        log('EntityManager', 'createCoPlayer', 'sessionId', sessionId)

        const player = this.playerCreator.createPlayer(sessionId, {
            entity: schema,
            isClientPlayer: false
        })

        this.cameraStage.addChildAtLayer(player, CameraLayer.Players)

        return player
    }

    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, velocity?: number): void {
        log('EntityManager', 'createProjectile', 'type', ProjectileType[type], 'velocity', velocity, 'x', x, 'y', y, 'rotation', rotation)

        this.projectileCreator.createProjectile(type, x, y, rotation, velocity)
    }

    registerEntity(sessionId: string, localEntity: LocalEntity | ClientEntity) {
        log('EntityManager', 'registerEntity', 'sessionId', sessionId)

        localEntity = (localEntity instanceof ClientEntity)
            ? { clientEntity: localEntity } : localEntity

        this._clientEntities.set(sessionId, localEntity)
    }

    clearClientEntities() {
        log('EntityManager', 'clearClientEntities')

        this.playerCreator.clearRegisteredPlayer()
        this._clientEntities.clear()
    }

    getSchema(sessionId: string): EntitySchema {
        return this._clientEntities[sessionId]
    }

    get camera() {
        return this.game.camera
    }

    get cameraViewport() {
        return this.camera.viewport
    }

    get cameraStage() {
        return this.camera.stage
    }

    get clientEntities() {
        return this._clientEntities
    }

    get roomState() {
        return RoomManager._room ? RoomManager._room.state : undefined
    }
}
