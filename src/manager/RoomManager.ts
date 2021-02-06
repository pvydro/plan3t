import { Room } from 'colyseus.js'
import { PlanetGameState, PlanetSphericalSchema } from '../network/schema/PlanetGameState'
import { Entity } from '../network/rooms/Entity'
import { IClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { IClientManager } from './ClientManager'
import { IEntityManager } from './EntityManager'
import { Flogger } from '../service/Flogger'
import { IGameMapManager } from './GameMapManager'
import { SphericalBiome, SphericalData } from '../gamemap/spherical/SphericalData'
import { SphericalPoint } from '../gamemap/spherical/SphericalPoint'
import { Dimension } from '../engine/math/Dimension'
import { RoomMessage } from '../network/rooms/ServerMessages'

export interface IRoomManager {
    initializeRoom(): Promise<Room>
    currentRoom: Room
    currentPlayerEntity: IClientPlayer
}

export interface RoomManagerOptions {
    clientManager: IClientManager
    gameMapManager: IGameMapManager
}

export class RoomManager implements IRoomManager {
    static _room: Room<PlanetGameState>
    
    gameMapManager: IGameMapManager
    clientManager: IClientManager
    entityManager: IEntityManager

    constructor(options: RoomManagerOptions) {
        this.clientManager = options.clientManager
        this.gameMapManager = options.gameMapManager
        this.entityManager = this.clientManager.entityManager
    }

    async initializeRoom(): Promise<Room> {
        Flogger.log('RoomManager', 'initializeRoom')

        const client = this.clientManager.client

        this.currentRoom = await client.joinOrCreate<PlanetGameState>('GameRoom')

        this.initializeCurrentRoomEntities()

        return new Promise((resolve) => {
            this.currentRoom.onStateChange.once((state) => {
                Flogger.log('RooManager', 'firstState received')
                
                if (state.planetHasBeenSet && state.planetSpherical !== undefined) {
                    this.parseRoomSpherical(state.planetSpherical).then(() => {

                        resolve(this.currentRoom)

                    })
                } else {
                    this.createMapAndSendToRoom().then(() => {
                        this.roomState.planetHasBeenSet = true

                        resolve(this.currentRoom)
                    })
                }
            })
        })
    }

    initializeCurrentRoomEntities() {
        console.log('%cGOTEM','background-color: blue; font-size:600%;')
        this.currentRoom.state.entities.onAdd = (entity, sessionID: string) => {
            this.addEntity(entity, sessionID)
        }
        this.currentRoom.state.entities.onRemove = (entity, sessionID: string) => {
            this.removeEntity(sessionID)
        }
    }

    async parseRoomSpherical(schema: PlanetSphericalSchema) {
        const parsedPoints = []

        for (var i in schema.points) {
            const point = schema.points[i]

            parsedPoints.push(new SphericalPoint({
                tileSolidity: point.tileSolidity, x: point.x, y: point.y,
                tileValue: {
                    r: point.tileValue.r,
                    g: point.tileValue.g,
                    b: point.tileValue.b,
                    a: point.tileValue.a
                }
            }))
        }
        // points: state.planetSpherical.points,
        const sphericalData = new SphericalData({
            points: parsedPoints,
            biome: (schema.biome as SphericalBiome),
            dimension: new Dimension(schema.dimension.width, schema.dimension.height)
        })

        await this.gameMapManager.initialize(sphericalData)
    }

    async createMapAndSendToRoom(): Promise<void> {
        await this.gameMapManager.initializeRandomSpherical()

        const currentData = this.gameMapManager.gameMap.currentSpherical.data

        this.currentRoom.send(RoomMessage.NewPlanet, { planet: currentData.toPlainFormat() })
            // , { planet: this.gameMapManager.gameMap.currentSpherical.data })
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

    get client() {
        return this.clientManager.client
    }

    get roomState() {
        return this.currentRoom.state
    }
}
