import * as PIXI from 'pixi.js'
import { Entity } from '../network/rooms/Entity'
import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { RoomManager } from '../manager/RoomManager'
import { ICamera } from '../camera/Camera'
import { ClientEntity } from '../cliententity/ClientEntity'
import { LoggingService } from '../service/LoggingService'
import { GravityManager, IGravityManager } from './GravityManager'

export interface IEntityManager {
    entities: { [id: string]: Entity }
    clientEntities: { [id: string]: ClientEntity }
    currentPlayerEntity: ClientPlayer
    createClientPlayer(entity: Entity, sessionID: string): void
    createEnemyPlayer(entity: Entity, sessionID: string): void
    updateEntity(entity: Entity, sessionID: string, changes?: any): void
    removeEntity(sessionID: string, entity?: Entity): void
}

export interface EntityManagerOptions {
    camera: ICamera
}

export class EntityManager implements IEntityManager {
    _entities: { [id: string]: any } = {}
    _clientEntities: { [id: string]: any } = {}//ClientEntity } = {}
    _currentPlayerEntity: any//PIXI.Graphics

    camera: ICamera
    gravityManager: IGravityManager

    constructor(options: EntityManagerOptions) {
        this.camera = options.camera

        this.gravityManager = GravityManager.getInstance()
    }

    createEnemyPlayer(entity: Entity, sessionID: string) {
        LoggingService.log('EntityManager', 'createEntity', 'sessionID', sessionID)
        const enemyPlayer = new ClientPlayer({ entity })
        
        this._entities[sessionID] = entity
        this._clientEntities[sessionID] = enemyPlayer
        
        this.viewport.addChild(enemyPlayer)
    }
    
    createClientPlayer(entity: Entity, sessionID: string) {
        const player = new ClientPlayer({
            entity,
            clientControl: true
        })
        const playerDisplayObject = (player as PIXI.DisplayObject)

        this._currentPlayerEntity = player
        this._clientEntities[sessionID] = this.currentPlayerEntity

        this.camera.addChild(this.currentPlayerEntity)
        this.camera.follow(playerDisplayObject)
    }

    updateEntity(entity: Entity, sessionID: string, changes?: any) {
        const isLocalPlayer = RoomManager.isSessionALocalPlayer(sessionID)

        if (!isLocalPlayer) {
            const clientEntity = this.clientEntities[sessionID]

            
            // this.clientEntities[sessionID].x = entity.x
            // this.clientEntities[sessionID].y = entity.y
        }
    }

    removeEntity(sessionID: string, entity?: Entity) {
        const removedClientEntity = this.clientEntities[sessionID]
        
        this.viewport.removeChild(removedClientEntity)

        delete this.entities[sessionID]
    }

    get currentPlayerEntity() {
        return this._currentPlayerEntity
    }

    get viewport() {
        return this.camera.viewport
    }

    get entities() {
        return this._entities
    }

    get clientEntities() {
        return this._clientEntities
    }
}
