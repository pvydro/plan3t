import { Client, Room } from 'colyseus'
import { log } from '../../service/Flogger'
import { IRoomEvent, RoomEvent } from '../event/RoomEvent'
import { ChatMessageSchema } from '../schema/ChatMessageSchema'
import { ServerGameState } from '../schema/serverstate/ServerGameState'
import { GameRoomListener, IGameRoomListener, IRoomListenerDelegate } from './GameRoomListener'
import { ChatMessagePayload, ClientMessage, PlayerPayload, RoomMessage } from './ServerMessages'
import { AIActionPayload } from '../../ai/AIAction'
import { BulletStatePack, WeaponStatePack } from '../../cliententity/clientplayer/state/WeaponStatePack'
import { v4 } from 'uuid'
import { PlayerLegsState } from '../utils/Enum'

export interface IGameRoom extends IRoomListenerDelegate {
    state: ServerGameState

    onMessage<T = any>(messageType: '*', callback: (client: Client, type: string | number, message: T) => void): any
    onMessage<T = any>(messageType: string | number, callback: (client: Client, message: T) => void): any
}

export class GameRoom extends Room<ServerGameState> implements IGameRoom {
    static Delta: number = 1
    listener!: IGameRoomListener
    
    onCreate() {
        this.listener = new GameRoomListener(this)
        this.initialize()

        this.handleChatEvent(new RoomEvent(RoomMessage.NewChatMessage, { sender: 'Server', text: 'New Room ID: ' + this.roomId }, this.clients[0]))
    }

    initialize() {
        this.state.initialize()
        this.listener.startListening()

        // Server-side game loop
        this.setSimulationInterval((deltaTime: number) => {
            GameRoom.Delta = (deltaTime * 60 / 1000)
            this.state.update()
        })
    }

    onJoin(client: Client, options: any) {
        log('GameRoom', 'id', client.sessionId, 'Player joined', 'options', options)

        // this.state.createPlayer({ sessionId: client.sessionId })
    }

    handleRequestPlayer(event: IRoomEvent<any>) {
        this.state.createPlayer({
            sessionId: event.client.sessionId
        })
    }
  
    onLeave(client: Client) {
        log('GameRoom', 'id', client.sessionId, 'Player left')

        const entity = this.state.players[client.sessionId]

        if (entity) { entity.dead = true }
    }

    handleChatEvent(event: IRoomEvent<ChatMessagePayload>) {
        log('GameRoom', 'handleChatEvent', event.data)
    
        this.state.messages.add(new ChatMessageSchema()
            .assign(event.data))
    
        this.clients.forEach((client: Client) => {
            client.send(ClientMessage.UpdateChat)
        })
    }

    handlePlayerEvent(event: IRoomEvent<PlayerPayload>) {
        log('GameRoom', 'handlePlayerEvent', event.client.id)
        
        const payload = event.data
        const player = this.players.get(event.client.sessionId)

        if (player.isOnGround !== payload.isOnGround) {
            log('Player onGround change', player.isOnGround, payload.isOnGround)

            if (payload.legsState == PlayerLegsState.Jumping) {
                player.jump()
            }

            player.isOnGround = payload.isOnGround
            player.y = payload.y
            player.yVel = payload.yVel
        }

        player.legsState = payload.legsState
        player.bodyState = payload.bodyState
        player.walkingDirection = payload.walkingDirection
        player.direction = payload.direction
        player.x = payload.x
        player.xVel = payload.xVel
        player.frozen = payload.frozen

        if (payload.frozen) log('Freezing player')
    }

    handleWeaponEvent(event: IRoomEvent<WeaponStatePack>) {
        log('GameRoom', 'handleWeaponEvent', event.client.id)

        // const { shouldShoot } = event.data

        // if (shouldShoot) {
        //     this.createProjectile(event.data)
        // }
    }

    handleShootEvent(event: IRoomEvent<BulletStatePack>) {
        log('GameRoom', 'handleShootEvent', event.data.playerId)

        this.createProjectile(event.data)
    }

    handleAIActionEvent(event: IRoomEvent<AIActionPayload>) {
        const entity = this.state.creatures.get(event.data.actionData.entityID)


    }

    get players() {
        return this.state.players
    }

    // Creators
    protected createProjectile(payload: BulletStatePack) {
        this.state.createProjectile({
            ...payload,
            sessionId: v4()
        })
    }
}
