import { Room } from 'colyseus.js'
import { PlanetGameState } from '../../network/schema/planetgamestate/PlanetGameState'
import { PlanetSphericalSchema } from '../../network/schema/planetgamestate/PlanetSphericalSchema'
import { EntitySchema } from '../../network/schema/EntitySchema'
import { ClientManager, IClientManager } from '../ClientManager'
import { IEntityManager } from '../entitymanager/EntityManager'
import { importantLog, log } from '../../service/Flogger'
import { IGameMapManager } from '../GameMapManager'
import { SphericalBiome, SphericalData } from '../../gamemap/spherical/SphericalData'
import { SphericalPoint } from '../../gamemap/spherical/SphericalPoint'
import { Dimension } from '../../engine/math/Dimension'
import { ClientMessage, RoomMessage } from '../../network/rooms/ServerMessages'
import { ProjectileSchema } from '../../network/schema/ProjectileSchema'
import { RoomMessenger } from './RoomMessenger'
import { PlayerSchema } from '../../network/schema/PlayerSchema'
import { ProjectileType } from '../../weapon/projectile/Bullet'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { Spherical } from '../../gamemap/spherical/Spherical'
import { MapBuildingType } from '../../gamemap/mapbuilding/MapBuilding'
import { IRoomStateManager, RoomStateManager } from './RoomStateManager'
import { CreatureSchema } from '../../network/schema/CreatureSchema'
import { Environment } from '../../main/Environment'
import { WaveRunnerSchema, WaveSchema } from '../../network/schema/waverunner/WaveRunnerSchema'
import { ChatService } from '../../service/chatservice/ChatService'
import { ChatSender } from '../../service/chatservice/ChatSenderConstants'

export interface IRoomManager {
    initializeRoom(): Promise<Room>
    requestWaveRunnerGame(): Promise<WaveRunnerSchema>
    currentRoom: Room
}

export interface RoomManagerOptions {
    clientManager: IClientManager
    gameMapManager: IGameMapManager
}

export class RoomManager implements IRoomManager {
    private static Instance: RoomManager
    static _room: Room<PlanetGameState>
    static _clientSessionId = 'local'
    
    roomStateManager: IRoomStateManager
    gameMapManager: IGameMapManager
    clientManager: IClientManager
    entityManager: IEntityManager

    static getInstance(options?: RoomManagerOptions): RoomManager | undefined {
        if (RoomManager.Instance === undefined) {
            if (options === undefined) {
                return undefined
            } else {
                RoomManager.Instance = new RoomManager(options)
            }
        }

        return RoomManager.Instance
    }

    private constructor(options: RoomManagerOptions) {
        this.roomStateManager = new RoomStateManager()
        this.clientManager = ClientManager.getInstance()
        this.gameMapManager = options.gameMapManager
        this.entityManager = this.clientManager.entityManager
    }

    async initializeRoom(): Promise<Room> {
        log('RoomManager', 'initializeRoom')
        const client = this.clientManager.client

        this.currentRoom = await client.joinOrCreate<PlanetGameState>('GameRoom')

        RoomManager.clientSessionId = this.currentRoom.sessionId
        RoomMessenger._isOnline = true
        
        this.initializeCurrentRoomEntities()

        return new Promise((resolve) => {
            // First state change
            this.currentRoom.onStateChange.once((state: PlanetGameState) => {
                log('RoomManager', 'firstState received')

                this.roomStateManager.stateChanged(state)

                if (RoomManager.clientSessionId === state.hostId) {
                    importantLog('Host sessionId found, setting in Environment', 'sessionId', RoomManager.clientSessionId)

                    Environment.IsHost = true
                }
                
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

            this.currentRoom.onStateChange((state: PlanetGameState) => {
                importantLog('onStateChange')
                this.roomStateManager.stateChanged(state)
            })

            this.currentRoom.onMessage(ClientMessage.UpdateChat, (message) => {
                if (ChatService._serverMessages !== message) {
                    ChatService._serverMessages = message
                    ChatService.fetchChatHistoryFromRoom()
                }
            })
        })
    }

    requestWaveRunnerGame(): Promise<WaveRunnerSchema> {
        log('RoomManager', 'requestWaveRunnerGame')

        return new Promise((resolve) => {
            // this.currentRoom.onMessage
            if (this.currentRoom.state.waveGameHasBeenStarted
            && this.currentRoom.state.waveRunner) {
                resolve(this.currentRoom.state.waveRunner)
            } else {
                RoomMessenger.sendAndExpect(RoomMessage.NewWaveRunner, undefined, ClientMessage.WaveRunnerStarted).then((message: WaveRunnerSchema) => {
                    log('RoomManager', 'received wave runner game')

                    ChatService.sendMessage({ sender: ChatSender.Server, text: 'Wave runner started' })
                    
                    resolve(message)
                })
            }

            // resolve(true)
        })
    }

    initializeCurrentRoomEntities() {
        this.currentRoom.state.players.onAdd = (player: PlayerSchema, sessionId: string) => {
            this.addPlayer(player, sessionId)
        }
        this.currentRoom.state.players.onRemove = (player: PlayerSchema, sessionId: string) => {
            this.removePlayer(sessionId)
        }

        this.currentRoom.state.projectiles.onAdd = (schema: ProjectileSchema, key: number) => {
            if (schema.sessionId !== RoomManager.clientSessionId) {
                this.addProjectile(schema)
            }
        }
        this.currentRoom.state.creatures.onAdd = (creature: CreatureSchema, key: string) => {
            // this
        }
    }

    async parseRoomSpherical(schema: PlanetSphericalSchema) {
        log('RoomManager', 'parseRoomSpherical', 'schema', {
            'biome': schema.biome,
            'dimension': schema.dimension
        })

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
        const temporarilyLoadBuilding = true
        
        if (temporarilyLoadBuilding) {
            await this.gameMapManager.initializeBuilding(MapBuildingType.Dojo)
        } else {
            await this.gameMapManager.initializeRandomSpherical()

            const currentSpherical = this.gameMapManager.gameMap.currentMap as Spherical
    
            if (currentSpherical) {
                const currentData = currentSpherical.data
    
                if (currentData) {
                    this.currentRoom.send(RoomMessage.NewPlanet, { planet: currentData.toPayloadFormat() })
                }
            }
        }
    }

    addPlayer(entity?: EntitySchema, sessionId?: string) {
        importantLog('RoomManager', 'addPlayer', 'sessionId', sessionId)

        if (RoomManager.isSessionALocalPlayer(sessionId)) {
            this.entityManager.createClientPlayer(entity, sessionId)
        } else {
            this.entityManager.createCoPlayer(entity, sessionId)
        }
    
        entity.onChange = (changes) => {
            this.entityManager.updateEntity(entity, sessionId, changes)
        }
    }

    removePlayer(sessionId: string) {
        importantLog('RoomManager', 'removePlayer', 'sessionId', sessionId)

        this.entityManager.removeEntity(sessionId)
    }

    addProjectile(schema: ProjectileSchema) {
        this.entityManager.createProjectile(ProjectileType.Bullet,
            schema.x, schema.y, schema.rotation, schema.xVel)
    }

    addCreature(creature: CreatureSchema) {
        importantLog('RoomManager', 'addCreature', 'creature', 'type', creature.creatureType)

        this.entityManager.createCreature(creature)
    }

    requestClientPlayerRespawn() {
        const clientPlayer = ClientPlayer.getInstance()

        clientPlayer.requestRespawn()
    }

    static isSessionALocalPlayer(sessionId: string) {
        if (sessionId === RoomManager.clientSessionId) {
            return true
        } else {
            return false
        }
    }

    static set clientSessionId(value: string) {
        importantLog('New client session ID has been set', value)
        
        this._clientSessionId = value
    }

    static get clientSessionId() {
        return this._clientSessionId
    }

    get isHost() {
        return (RoomManager.clientSessionId === this.currentRoom.state.hostId)
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
