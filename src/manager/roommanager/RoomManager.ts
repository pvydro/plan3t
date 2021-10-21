import { Room } from 'colyseus.js'
import { PlanetGameState } from '../../network/schema/planetgamestate/PlanetGameState'
import { EntitySchema } from '../../network/schema/EntitySchema'
import { ClientManager, IClientManager } from '../ClientManager'
import { IEntityManager } from '../entitymanager/EntityManager'
import { importantLog, log } from '../../service/Flogger'
import { IGameMapManager } from '../GameMapManager'
import { ClientMessage } from '../../network/rooms/ServerMessages'
import { ProjectileSchema } from '../../network/schema/ProjectileSchema'
import { RoomMessenger } from './RoomMessenger'
import { PlayerSchema } from '../../network/schema/PlayerSchema'
import { ProjectileType } from '../../weapon/projectile/Bullet'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IRoomStateManager, RoomStateManager } from './RoomStateManager'
import { CreatureSchema } from '../../network/schema/CreatureSchema'
import { ChatService } from '../../service/chatservice/ChatService'

export interface IRoomManager {
    initializeRoom(): Promise<Room>
    currentRoom: Room
}

export interface RoomManagerOptions {
    clientManager: IClientManager
    gameMapManager: IGameMapManager
}

export class RoomManager implements IRoomManager {
    private static Instance: RoomManager
    private static _clientSessionId = 'local'
    static _room: Room<PlanetGameState>
    
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
        this.roomStateManager = new RoomStateManager(options)
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
                this.roomStateManager.setInitialState(state).then(() => {
                    resolve(this.currentRoom)
                })
            })

            this.startListening()
        })
    }

    startListening() {
        log('RoomManager', 'startListening')

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

    // requestWaveRunnerGame(): Promise<WaveRunnerSchema> {
    //     log('RoomManager', 'requestWaveRunnerGame')

    //     return new Promise((resolve) => {
    //         if (this.currentRoom.state.waveGameHasBeenStarted
    //         && this.currentRoom.state.waveRunner) {
    //             resolve(this.currentRoom.state.waveRunner)
    //         } else {
    //             RoomMessenger.sendAndExpect(RoomMessage.NewWaveRunner, undefined, ClientMessage.WaveRunnerStarted).then((message: WaveRunnerSchema) => {
    //                 log('RoomManager', 'received wave runner game')

    //                 ChatService.sendMessage({ sender: ChatSender.Server, text: 'Wave runner started' })
                    
    //                 resolve(message)
    //             })
    //         }
    //     })
    // }

    // async createMapAndSendToRoom(): Promise<void> {
    //     const temporarilyLoadBuilding = true
        
    //     if (temporarilyLoadBuilding) {
    //         await this.gameMapManager.initializeBuilding(MapBuildingType.Dojo)
    //     } else {
    //         await this.gameMapManager.initializeRandomSpherical()

    //         const currentSpherical = this.gameMapManager.gameMap.currentMap as Spherical
    
    //         if (currentSpherical) {
    //             const currentData = currentSpherical.data
    
    //             if (currentData) {
    //                 this.currentRoom.send(RoomMessage.NewPlanet, { planet: currentData.toPayloadFormat() })
    //             }
    //         }
    //     }
    // }

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
            schema.x, schema.y, schema.rotation, schema.velocity)
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
