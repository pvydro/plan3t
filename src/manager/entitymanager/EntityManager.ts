import { Entity } from '../../network/rooms/Entity'
import { RoomManager } from '../roommanager/RoomManager'
import { Camera } from '../../camera/Camera'
import { ClientEntity } from '../../cliententity/ClientEntity'
import { Flogger, log } from '../../service/Flogger'
import { GravityManager, IGravityManager } from '../GravityManager'
import { Game } from '../../main/Game'
import { ProjectileType } from '../../weapon/projectile/Bullet'
import { PlanetGameState } from '../../network/schema/planetgamestate/PlanetGameState'
import { EntityPlayerCreator, IEntityPlayerCreator } from './EntityPlayerCreator'
import { EntitySynchronizer, IEntitySynchronizer } from '../../synchronizer/EntitySynchronizer'
import { EntityProjectileCreator, IEntityProjectileCreator } from './EntityProjectileCreator'
import { IUpdatable } from '../../interface/IUpdatable'
import { EntityCreatureCreator, IEntityCreatureCreator } from './EntityCreatureCreator'
import { CreatureType } from '../../creature/Creature'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { Key } from 'ts-keycode-enum'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { EnemyManager, IEnemyManager } from '../enemymanager/EnemyManager'

export interface LocalEntity {
    serverEntity?: Entity
    clientEntity?: ClientEntity
}

export interface IEntityManager extends IUpdatable {
    clientEntities: Map<string, LocalEntity>
    camera: Camera
    roomState: PlanetGameState
    gravityManager: IGravityManager
    enemyManager: IEnemyManager
    createClientPlayer(entity: Entity, sessionId: string): ClientPlayer
    createEnemyPlayer(entity: Entity, sessionId: string): ClientPlayer
    createOfflinePlayer(): ClientPlayer
    clearClientEntities(): void
    updateEntity(entity: Entity, sessionId: string, changes?: any): void
    removeEntity(sessionId: string, layer?: number): void
    registerEntity(sessionId: string, localEntity: LocalEntity | ClientEntity): void
    getEntity(sessionId: string): Entity
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
        // this.gravityManager = GravityManager.getInstance()
        this.gravityManager = new GravityManager({ enemyManager: entityManager.enemyManager })
        this.playerCreator = new EntityPlayerCreator({ entityManager })
        this.creatureCreator = new EntityCreatureCreator({ entityManager })
        this.projectileCreator = new EntityProjectileCreator({ entityManager })
        this.synchronizer = new EntitySynchronizer({ entityManager })
        this.enemyManager = new EnemyManager({ entityManager })

        // Test key listeners
        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which == Key.C) {
                this.createPassiveCreature()
            }
        })
    }

    update() {
        this.synchronizer.update()
    }

    removeEntity(sessionId: string, layer?: number) {
        const removedLocalEntity = this._clientEntities.get(sessionId)
        
        this.cameraStage.removeFromLayer(removedLocalEntity.clientEntity, layer)
        this._clientEntities.delete(sessionId)

        delete removedLocalEntity.clientEntity
        delete removedLocalEntity.serverEntity
    }
    
    updateEntity(entity: Entity, sessionId: string, changes?: any) {
        log('EntityManager', 'updateEntity', 'sessionId', sessionId)

        this.synchronizer.updateEntity(entity, sessionId, changes)
    }

    createPassiveCreature() {
        log('EntityManager', 'createPassiveCreature')

        this.creatureCreator.createCreature({
            type: CreatureType.Koini
        })
    }

    createOfflinePlayer() {
        log('EntityManager', 'createOfflinePlayer')

        const player = this.playerCreator.createPlayer({
            isClientPlayer: true,
            isOfflinePlayer: true
        })

        return player
    }

    createClientPlayer(entity: Entity, sessionId: string) {
        log('EntityManager', 'createClientPlayer', 'sessionId', sessionId)

        const player = this.playerCreator.createPlayer({
            entity, sessionId,
            isClientPlayer: true
        })

        this.synchronizer.assertionService.clientPlayer = player

        return player
    }

    createEnemyPlayer(entity: Entity, sessionId: string) {
        log('EntityManager', 'createEntity', 'sessionId', sessionId)

        const player = this.playerCreator.createPlayer({ entity, sessionId })

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

    getEntity(sessionId: string) {
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
