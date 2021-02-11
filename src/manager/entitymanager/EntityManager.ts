import { Entity } from '../../network/rooms/Entity'
import { RoomManager } from '../roommanager/RoomManager'
import { Camera } from '../../camera/Camera'
import { ClientEntity } from '../../cliententity/ClientEntity'
import { Flogger } from '../../service/Flogger'
import { GravityManager, IGravityManager } from '../GravityManager'
import { Game } from '../../main/Game'
import { ProjectileType } from '../../weapon/projectile/Bullet'
import { PlanetGameState } from '../../network/schema/planetgamestate/PlanetGameState'
import { EntityPlayerCreator, IEntityPlayerCreator } from './EntityPlayerCreator'
import { EntitySynchronizer, IEntitySynchronizer } from '../../synchronizer/EntitySynchronizer'
import { EntityProjectileCreator, IEntityProjectileCreator } from './EntityProjectileCreator'
import { IUpdatable } from '../../interface/IUpdatable'

export interface LocalEntity {
    serverEntity?: Entity
    clientEntity?: ClientEntity
}

export interface IEntityManager extends IUpdatable {
    clientEntities: Map<string, LocalEntity>
    camera: Camera
    roomState: PlanetGameState
    createClientPlayer(entity: Entity, sessionId: string): void
    createEnemyPlayer(entity: Entity, sessionId: string): void
    updateEntity(entity: Entity, sessionId: string, changes?: any): void
    removeEntity(sessionId: string, layer?: number, entity?: Entity): void
    registerEntity(sessionId: string, localEntity: LocalEntity): void
    getEntity(sessionId: string): Entity
    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, bulletVelocity?: number): void
}

export interface EntityManagerOptions {
    game?: Game
}

export class EntityManager implements IEntityManager {
    _clientEntities: Map<string, LocalEntity> = new Map()

    game: Game
    gravityManager: IGravityManager
    playerCreator: IEntityPlayerCreator
    projectileCreator: IEntityProjectileCreator
    synchronizer: IEntitySynchronizer

    constructor(options: EntityManagerOptions) {
        const entityManager = this

        this.game = options.game
        this.gravityManager = GravityManager.getInstance()

        this.playerCreator = new EntityPlayerCreator({ entityManager })
        this.projectileCreator = new EntityProjectileCreator({ entityManager })
        this.synchronizer = new EntitySynchronizer({ entityManager })
    }

    update() {
        this.synchronizer.update()
    }

    removeEntity(sessionId: string, layer?: number, entity?: Entity) {
        const removedLocalEntity = this._clientEntities.get(sessionId)
        
        this.cameraStage.removeFromLayer(removedLocalEntity.clientEntity, layer)
        this._clientEntities.delete(sessionId)

        delete removedLocalEntity.clientEntity
        delete removedLocalEntity.serverEntity
    }
    
    updateEntity(entity: Entity, sessionId: string, changes?: any) {
        Flogger.log('EntityManager', 'updateEntity', 'sessionId', sessionId)
        this.synchronizer.updateEntity(entity, sessionId, changes)
    }

    createClientPlayer(entity: Entity, sessionId: string) {
        Flogger.log('EntityManager', 'createClientPlayer', 'sessionId', sessionId)

        this.playerCreator.createPlayer({ entity, sessionId, isClientPlayer: true })
        this.synchronizer.assertionService.startLoopingAssertion()
    }

    createEnemyPlayer(entity: Entity, sessionId: string) {
        Flogger.log('EntityManager', 'createEntity', 'sessionId', sessionId)
        this.playerCreator.createPlayer({ entity, sessionId })
    }

    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, velocity?: number): void {
        Flogger.log('EntityManager', 'createProjectile', 'type', ProjectileType[type], 'velocity', velocity)
        this.projectileCreator.createProjectile(type, x, y, rotation, velocity)
    }

    registerEntity(sessionId: string, localEntity: LocalEntity) {
        Flogger.log('EntityManager', 'registerEntity', 'sessionId', sessionId)
        this._clientEntities[sessionId] = localEntity
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
        return RoomManager._room.state
    }
}
