import * as PIXI from 'pixi.js'
import { v4 as uuidv4 } from 'uuid'
import { Entity } from '../../network/rooms/Entity'
import { ClientPlayer, PlayerBodyState } from '../../cliententity/clientplayer/ClientPlayer'
import { RoomManager } from '../roommanager/RoomManager'
import { Camera, ICamera } from '../../camera/Camera'
import { ClientEntity } from '../../cliententity/ClientEntity'
import { Flogger } from '../../service/Flogger'
import { GravityManager, IGravityManager } from '../GravityManager'
import { Game } from '../../main/Game'
import { Bullet, ProjectileType } from '../../weapon/projectile/Bullet'
import { CameraLayer } from '../../camera/CameraStage'
import { Player } from '../../network/rooms/Player'
import { Direction } from '../../engine/math/Direction'
import { PlayerLegsState } from '../../network/utils/Enum'
import { PlanetGameState } from '../../network/schema/planetgamestate/PlanetGameState'
import { EntityPlayerCreator, IEntityPlayerCreator } from './EntityPlayerCreator'
import { EntitySynchronizer, IEntitySynchronizer } from './EntitySynchronizer'

export interface LocalEntity {
    serverEntity?: Entity
    clientEntity?: ClientEntity
}

export interface IEntityManager {
    clientEntities: Map<string, LocalEntity>//{ [id: string]: ClientEntity }
    // currentPlayerEntity: ClientPlayer
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
    synchronizer: IEntitySynchronizer

    constructor(options: EntityManagerOptions) {
        const entityManager = this

        this.game = options.game
        this.gravityManager = GravityManager.getInstance()

        this.playerCreator = new EntityPlayerCreator({ entityManager })
        this.synchronizer = new EntitySynchronizer({ entityManager })
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

    updatePlayer(player: Player, sessionId: string, changes?: any) {        
        if (RoomManager.isSessionALocalPlayer(sessionId)) return
        
        const clientPlayer = this.clientEntities.get(sessionId).clientEntity as ClientPlayer
        const playerState = this.roomState.players.get(sessionId)

        clientPlayer.direction = playerState.direction as Direction
        clientPlayer.walkingDirection = playerState.walkingDirection as Direction
        clientPlayer.bodyState = playerState.bodyState as PlayerBodyState
        clientPlayer.legsState = playerState.legsState as PlayerLegsState
        // clientEntity.xVel = playerState.xVel
        // clientPlayer.x = playerState.x
        // clientPlayer.y = playerState.y
    }

    removeEntity(sessionId: string, layer?: number, entity?: Entity) {
        const removedLocalEntity = this._clientEntities.get(sessionId)
        
        this.cameraStage.removeFromLayer(removedLocalEntity.clientEntity, layer)
        this._clientEntities.delete(sessionId)

        delete removedLocalEntity.clientEntity
        delete removedLocalEntity.serverEntity
    }

    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, velocity?: number): void {
        Flogger.log('EntityManager', 'createProjectile', 'type', ProjectileType[type], 'velocity', velocity)
        
        const maximumIndex = this.cameraStage.children.length - 1
        const bullet = new Bullet({
            rotation, velocity
        })
        bullet.sprite.anchor.set(0.5, 0.5)
        bullet.x = x
        bullet.y = y

        this.cameraStage.addChildAt(bullet, maximumIndex)

        this.registerEntity(bullet.id.toString(), {
            clientEntity: bullet
        })
    }

    createEnemyPlayer(entity: Entity, sessionId: string) {
        Flogger.log('EntityManager', 'createEntity', 'sessionId', sessionId)
        
        this.playerCreator.createPlayer({ entity, sessionId })
    }
    
    createClientPlayer(entity: Entity, sessionId: string) {
        Flogger.log('EntityManager', 'createClientPlayer', 'sessionId', sessionId)

        this.playerCreator.createPlayer({ entity, sessionId, isClientPlayer: true })
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
