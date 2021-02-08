import { Room } from 'colyseus.js'
import { PlanetGameState, PlanetSphericalSchema } from '../../network/schema/PlanetGameState'
import { Entity } from '../../network/rooms/Entity'
import { IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IClientManager } from '../ClientManager'
import { IEntityManager } from '../EntityManager'
import { Flogger } from '../../service/Flogger'
import { IGameMapManager } from '../GameMapManager'
import { SphericalBiome, SphericalData } from '../../gamemap/spherical/SphericalData'
import { SphericalPoint } from '../../gamemap/spherical/SphericalPoint'
import { Dimension } from '../../engine/math/Dimension'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { RoomMessager } from './RoomMessager'

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
    private static INSTANCE: RoomManager
    static _room: Room<PlanetGameState>
    
    gameMapManager: IGameMapManager
    clientManager: IClientManager
    entityManager: IEntityManager

    static getInstance(options?: RoomManagerOptions): RoomManager | undefined {
        if (RoomManager.INSTANCE === undefined) {
            if (options === undefined) {
                return undefined
            } else {
                RoomManager.INSTANCE = new RoomManager(options)
            }
        }

        return RoomManager.INSTANCE
    }

    private constructor(options: RoomManagerOptions) {
        this.clientManager = options.clientManager
        this.gameMapManager = options.gameMapManager
        this.entityManager = this.clientManager.entityManager
    }

    async initializeRoom(): Promise<Room> {
        Flogger.log('RoomManager', 'initializeRoom')

        const client = this.clientManager.client

        this.currentRoom = await client.joinOrCreate<PlanetGameState>('GameRoom')
        this.initializeCurrentRoomEntities()

        RoomMessager._isOnline = true

        return new Promise((resolve) => {
            this.currentRoom.onStateChange.once((state) => {
                Flogger.log('RooManager', 'firstState received')
                
                if (state.planetHasBeenSet) {
                    if (state.planetSpherical !== undefined) {
                        this.parseRoomSpherical(state.planetSpherical).then(() => {
                            resolve(this.currentRoom)
                        })
                    }
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
        this.currentRoom.state.players.onAdd = (entity, sessionID: string) => {
            this.addEntity(entity, sessionID)
        }
        this.currentRoom.state.players.onRemove = (entity, sessionID: string) => {
            this.removeEntity(sessionID)
        }
    }

    async parseRoomSpherical(schema: PlanetSphericalSchema) {
        Flogger.log('RoomManager', 'parseRoomSpherical', 'schema', schema)

        const parsedPoints = []

        schema.points.forEach((point) => {
            parsedPoints.push(new SphericalPoint({
                x: point.x, y: point.y,
                tileSolidity: point.tileSolidity,
                tileValue: {
                    r: point.tileValue.r,
                    g: point.tileValue.g,
                    b: point.tileValue.b,
                    a: point.tileValue.a
                }
            }))
        })

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
    }

    addEntity(entity: Entity, sessionID: string) {
        if (RoomManager.isSessionALocalPlayer(sessionID)) {
            this.entityManager.createClientPlayer(entity, sessionID)
        } else {
            this.entityManager.createEnemyPlayer(entity, sessionID)
        }
    
        entity.onChange = (changes) => {
            console.log('entity on change')
            
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
