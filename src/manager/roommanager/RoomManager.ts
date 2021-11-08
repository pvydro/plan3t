import { Room, SchemaSerializer } from 'colyseus.js'
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
import { IServerGameState, ServerGameState } from '../../network/schema/serverstate/ServerGameState'
import { WaveRunnerGameState } from '../../network/schema/waverunnergamestate/WaveRunnerGameState'
import { PVPGameRoomState } from '../../network/schema/pvpgamestate/PVPGameRoomState'

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
    static _room: Room<any>
    
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

        this.currentRoom = await client.joinOrCreate<PVPGameRoomState>('GameRoom')

        RoomManager.clientSessionId = this.currentRoom.sessionId
        RoomMessenger._isOnline = true
        
        this.initializeCurrentRoomEntities()

        return new Promise((resolve) => {
            // First state change
            this.currentRoom.onStateChange.once((state: ServerGameState) => {
                this.roomStateManager.setInitialState(state).then(() => {
                    resolve(this.currentRoom)
                })
            })

            this.startListening()
        })
    }

    startListening() {
        log('RoomManager', 'startListening')

        this.currentRoom.onStateChange((state: ServerGameState) => {
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
            // if (schema.sessionId !== RoomManager.clientSessionId) {
            this.addProjectile(schema)
            // }
        }
        this.currentRoom.state.creatures.onAdd = (creature: CreatureSchema, key: string) => {
            // this
            this.addCreature(creature, creature.id)
        }
    }

    addPlayer(schema: PlayerSchema, id: string) {
        importantLog('RoomManager', 'addPlayer', 'sessionId', id)

        if (RoomManager.isSessionALocalPlayer(id)) {
            this.entityManager.createClientPlayer(schema, id)
        } else {
            this.entityManager.createCoPlayer(schema, id)
        }
    
        schema.onChange = changes => this.entityManager.updateEntity(schema, id, changes)
    }

    removePlayer(id: string) {
        importantLog('RoomManager', 'removePlayer', 'sessionId', id)

        this.entityManager.removeEntity(id)
    }

    addProjectile(schema: ProjectileSchema) {
        this.entityManager.createProjectile(ProjectileType.Bullet,
            schema.x, schema.y, schema.rotation, schema.velocity)
    }

    addCreature(schema: CreatureSchema, id: string) {
        importantLog('RoomManager', 'addCreature', 'creature', 'type', schema.creatureType)

        this.entityManager.createCreature(schema)

        schema.onChange = changes => this.entityManager.updateEntity(schema, id, changes)
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
