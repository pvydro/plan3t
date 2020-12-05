import * as PIXI from 'pixi.js'
import { Room } from 'colyseus.js'
import { GameState } from '../network/rooms/GameState'
import { Entity } from '../network/rooms/Entity'
import { IClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { IClientManager } from './ClientManager'
import { IEntityManager } from './EntityManager'
import { ICamera, Camera } from '../camera/Camera'
import { BasicLerp } from '../utils/Constants'

export interface IRoomManager {
    initializeRoom(): Promise<void>
    currentRoom: Room
    currentPlayerEntity: IClientPlayer
}

export interface RoomManagerOptions {
    clientManager: IClientManager
}

export class RoomManager implements IRoomManager {
    static _room: Room<GameState>
    
    clientManager: IClientManager
    entityManager: IEntityManager

    constructor(options: RoomManagerOptions) {
        this.clientManager = options.clientManager
        this.entityManager = this.clientManager.entityManager
    }

    async initializeRoom() {
        const client = this.clientManager.client

        this.currentRoom = await client.joinOrCreate<GameState>('GameRoom')

        this.initializeCurrentRoomEntities()
    }

    initializeCurrentRoomEntities() {
        this.currentRoom.state.entities.onAdd = (entity, sessionID: string) => {
            this.addEntity(entity, sessionID)
        }
        this.currentRoom.state.entities.onRemove = (entity, sessionID: string) => {
            this.removeEntity(sessionID)
        }
    }

    addEntity(entity: Entity, sessionID: string) {
        if (RoomManager.isSessionALocalPlayer(sessionID)) {
            this.entityManager.createClientPlayer(entity, sessionID)
        } else {
            this.entityManager.createEnemyPlayer(entity, sessionID)
        }
    
        entity.onChange = (changes) => {
            this.entityManager.updateEntity(entity, sessionID, changes)
        }
    }

    removeEntity(sessionID) {
        this.entityManager.removeEntity(sessionID)
    }

    static isSessionALocalPlayer(sessionID: string) {
        if (sessionID === RoomManager._room.sessionId) {
            return true
        } else {
            return false
        }
    }

    get currentPlayerEntity() {
        return this.entityManager.currentPlayerEntity
    }

    get currentRoom() {
        return RoomManager._room
    }

    set currentRoom(value) {
        RoomManager._room = value
    }
}
