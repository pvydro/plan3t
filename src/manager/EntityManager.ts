import * as PIXI from 'pixi.js'
import { Entity } from '../network/rooms/Entity'
import { Enemy } from '../cliententity/enemy/Enemy'
import { FlyingEnemy } from '../cliententity/enemy/flyingenemy/FlyingEnemy'
import { IClientPlayer, ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { IClientManager } from '../manager/ClientManager'
import { IRoomManager, RoomManager } from '../manager/RoomManager'
import { ICamera } from '../camera/Camera'
import { IClientEntity, ClientEntity } from '../cliententity/ClientEntity'

export interface IEntityManager {
    entities: { [id: string]: Entity }
    clientEntities: { [id: string]: ClientEntity }
    currentPlayerEntity: ClientPlayer
    createClientPlayer(entity: Entity, sessionID: string): void
    createEntity(entity: Entity, sessionID: string): void
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
    clientManager: IClientManager

    constructor(options: EntityManagerOptions) {
        this.camera = options.camera
    }

    createEntity(entity: Entity, sessionID: string) {
        // const clientEntity = new ClientEntity({ entity })
        const clientEntity = new FlyingEnemy(entity)
        
        this._entities[sessionID] = entity
        this._clientEntities[sessionID] = clientEntity
        
        this.viewport.addChild(clientEntity)
    }
    
    createClientPlayer(entity: Entity, sessionID: string) {
        const player = new ClientPlayer(entity)
        const playerDisplayObject = (player as PIXI.DisplayObject)

        this._currentPlayerEntity = player
        this._clientEntities[sessionID] = this.currentPlayerEntity

        this.viewport.addChild(this.currentPlayerEntity)
        this.viewport.follow(playerDisplayObject)
    }

    updateEntity(entity: Entity, sessionID: string, changes?: any) {
        const isLocalPlayer = RoomManager.isSessionALocalPlayer(sessionID)

        this.clientEntities[sessionID].x = entity.x
        this.clientEntities[sessionID].y = entity.y
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
