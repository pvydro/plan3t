import { Room, SchemaSerializer } from 'colyseus.js'
import { ClientManager, IClientManager } from '../ClientManager'
import { IEntityManager } from '../entitymanager/EntityManager'
import { importantLog, log } from '../../service/Flogger'
import { PlayerSchema } from '../../network/schema/PlayerSchema'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IRoomStateManager, RoomStateManager } from './RoomStateManager'
import { matchMaker } from '../../shared/Dependencies'

export interface IRoomManager {
    // initializeRoom(): Promise<Room>
    // currentRoom: Room
}

export class RoomManager implements IRoomManager {
    private static Instance: RoomManager
    private static _clientSessionId = 'local'
    
    roomStateManager: IRoomStateManager
    clientManager: IClientManager
    entityManager: IEntityManager

    static getInstance(): RoomManager | undefined {
        if (RoomManager.Instance === undefined) {
            RoomManager.Instance = new RoomManager()
        }

        return RoomManager.Instance
    }

    private constructor() {
        // this.roomStateManager = new RoomStateManager(options)
        this.clientManager = ClientManager.getInstance()
        this.entityManager = this.clientManager.entityManager
    }

    // async initializeRoom(): Promise<Room> {
    //     log('RoomManager', 'initializeRoom')

    //     // this.currentRoom = await matchMaker.client.joinOrCreate<PVPGameRoomState>('GameRoom')

    //     // RoomManager.clientSessionId = this.currentRoom.sessionId
    //     // RoomMessenger._isOnline = true
        
    //     this.initializeCurrentRoomEntities()

    //     return new Promise((resolve) => {
    //         // First state change
    //         // this.currentRoom.onStateChange.once((state: ServerGameState) => {
    //         //     this.roomStateManager.setInitialState(state).then(() => {
    //         //         resolve(this.currentRoom)
    //         //     })
    //         // })

    //         // this.startListening()
    //         // resolve()
    //     })
    // }

    startListening() {
        log('RoomManager', 'startListening')

        // this.currentRoom.onStateChange((state: ServerGameState) => {
        //     importantLog('onStateChange')
        //     this.roomStateManager.stateChanged(state)
        // })

        // this.currentRoom.onMessage(ClientMessage.UpdateChat, (message) => {
        //     if (ChatService._serverMessages !== message) {
        //         ChatService._serverMessages = message
        //         ChatService.fetchChatHistoryFromRoom()
        //     }
        // })
    }

    initializeCurrentRoomEntities() {
        // this.currentRoom.state.players.onAdd = (player: PlayerSchema, sessionId: string) => {
        //     this.addPlayer(player, sessionId)
        // }
        // this.currentRoom.state.players.onRemove = (player: PlayerSchema, sessionId: string) => {
        //     this.removePlayer(sessionId)
        // }

        // this.currentRoom.state.projectiles.onAdd = (schema: ProjectileSchema, key: number) => {
        //     // if (schema.sessionId !== RoomManager.clientSessionId) {
        //     this.addProjectile(schema)
        //     // }
        // }
        // this.currentRoom.state.creatures.onAdd = (creature: CreatureSchema, key: string) => {
        //     // this
        //     this.addCreature(creature, creature.id)
        // }
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

    // removePlayer(id: string) {
    //     importantLog('RoomManager', 'removePlayer', 'sessionId', id)

    //     this.entityManager.removeEntity(id)
    // }

    // addProjectile(schema: ProjectileSchema) {
    //     this.entityManager.createProjectile(schema)

    //     schema.onChange = changes => this.entityManager.updateEntity(schema, schema.id, changes)
    // }

    // addCreature(schema: CreatureSchema, id: string) {
    //     importantLog('RoomManager', 'addCreature', 'creature', 'type', schema.creatureType)

    //     this.entityManager.createCreature(schema)

    //     schema.onChange = changes => this.entityManager.updateEntity(schema, id, changes)
    // }

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

    get roomState() {
        return matchMaker.currentRoom?.state
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
