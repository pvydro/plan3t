import { Client, Room } from 'colyseus'
import { Flogger } from '../../service/Flogger'
import { IRoomEvent } from '../event/RoomEvent'
import { ChatMessageSchema } from '../schema/ChatMessageSchema'
import { PlayerSchema } from '../schema/PlayerSchema'
import { ServerGameState } from '../schema/serverstate/ServerGameState'
import { PlanetRoom } from './planetroom/PlanetRoom'
import { IGameRoomListener, IRoomListenerDelegate } from './GameRoomListener'
import { ChatMessagePayload, ClientMessage, WeaponStatusPayload } from './ServerMessages'

export interface IGameRoom extends IRoomListenerDelegate {
    state: ServerGameState

    onMessage<T = any>(messageType: '*', callback: (client: Client, type: string | number, message: T) => void): any
    onMessage<T = any>(messageType: string | number, callback: (client: Client, message: T) => void): any
}

export class GameRoom extends Room<ServerGameState> implements IGameRoom {
    listener!: IGameRoomListener

    onCreate() {
        this.initialize()
    }

    initialize() {
        this.state.initialize()

        // Server-side game loop
        this.setSimulationInterval((deltaTime: number) => {
            PlanetRoom.Delta = (deltaTime * 60 / 1000)

            this.state.players.forEach((player: PlayerSchema) => {
                player.x += player.xVel * PlanetRoom.Delta
                player.y += player.yVel * PlanetRoom.Delta
            })

            this.state.update()
        })

        this.onMessage
    }

    onJoin(client: Client, options: any) {
        Flogger.log('GameRoom', 'id', client.sessionId, 'Player joined', 'options', options)

        this.state.createPlayer(client.sessionId)
    }
  
    onLeave(client: Client) {
        Flogger.log('GameRoom', 'id', client.sessionId, 'Player left')

        const entity = this.state.players[client.sessionId]

        if (entity) { entity.dead = true }
    }

    handleChatEvent(event: IRoomEvent<ChatMessagePayload>) {
        Flogger.log('GameRoom', 'handleChatEvent', event.data)
    
        this.state.messages.add(new ChatMessageSchema()
            .assign(event.data))
    
        this.clients.forEach((client: Client) => {
            client.send(ClientMessage.UpdateChat)
        })
    }

    handleWeaponEvent(event: IRoomEvent<WeaponStatusPayload>) {

    }
}
