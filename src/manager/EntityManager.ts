import * as PIXI from 'pixi.js'
import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../network/rooms/Entity'
import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { RoomManager } from '../manager/RoomManager'
import { ICamera } from '../camera/Camera'
import { ClientEntity } from '../cliententity/ClientEntity'
import { Flogger } from '../service/Flogger'
import { GravityManager, IGravityManager } from './GravityManager'
import { Game } from '../main/Game'
import { Bullet, ProjectileType } from '../weapon/projectile/Bullet'

export interface IEntityManager {
    entities: { [id: string]: Entity }
    clientEntities: { [id: string]: ClientEntity }
    currentPlayerEntity: ClientPlayer
    createClientPlayer(entity: Entity, sessionID: string): void
    createEnemyPlayer(entity: Entity, sessionID: string): void
    updateEntity(entity: Entity, sessionID: string, changes?: any): void
    removeEntity(sessionID: string, entity?: Entity): void
    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, bulletVelocity?: number): void
}

export interface EntityManagerOptions {
    game?: Game
}

export class EntityManager implements IEntityManager {
    private static BulletIndex = 1

    _entities: { [id: string]: any } = {}
    _clientEntities: { [id: string]: any } = {}//ClientEntity } = {}
    _currentPlayerEntity: any//PIXI.Graphics

    game: Game
    gravityManager: IGravityManager

    constructor(options: EntityManagerOptions) {
        this.game = options.game

        this.gravityManager = GravityManager.getInstance()
    }

    createEnemyPlayer(entity: Entity, sessionID: string) {
        Flogger.log('EntityManager', 'createEntity', 'sessionID', sessionID)
        
        const enemyPlayer = new ClientPlayer({ entity })
        
        this._entities[sessionID] = entity
        this._clientEntities[sessionID] = enemyPlayer
        
        this.cameraStage.addChild(enemyPlayer)
    }
    
    createClientPlayer(entity: Entity, sessionID: string) {
        Flogger.log('EntityManager', 'createClientPlayer', 'sessionID', sessionID)

        const player = new ClientPlayer({
            entity,
            clientControl: true,
            entityManager: this
        })
        player.y = -20
        player.x = 150
        const playerDisplayObject = (player as PIXI.DisplayObject)

        this._currentPlayerEntity = player
        this._clientEntities[sessionID] = this.currentPlayerEntity

        this.cameraStage.addChild(this.currentPlayerEntity)
        this.camera.follow(playerDisplayObject)
    }

    updateEntity(entity: Entity, sessionID: string, changes?: any) {
        const isLocalPlayer = RoomManager.isSessionALocalPlayer(sessionID)

        if (!isLocalPlayer) {
            // const clientEntity = this.clientEntities[sessionID]

            
            // this.clientEntities[sessionID].x = entity.x
            // this.clientEntities[sessionID].y = entity.y
        }
    }

    removeEntity(sessionID: string, entity?: Entity) {
        const removedClientEntity = this.clientEntities[sessionID]
        
        this.cameraStage.removeChild(removedClientEntity)

        delete this.entities[sessionID]
    }

    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, velocity?: number): void {
        Flogger.log('EntityManager', 'createProjectile', 'type', ProjectileType[type])

        const bullet = new Bullet({
            rotation, velocity
        })
        bullet.sprite.anchor.set(0.5, 0.5)
        bullet.x = x
        bullet.y = y

        this.cameraStage.addChildAt(bullet, EntityManager.BulletIndex)
        this.clientEntities[uuidv4()] = bullet
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

    get currentPlayerEntity() {
        return this._currentPlayerEntity
    }

    get entities() {
        return this._entities
    }

    get clientEntities() {
        return this._clientEntities
    }
}
