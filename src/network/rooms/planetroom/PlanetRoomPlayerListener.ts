import { Client } from 'colyseus'
import { Flogger } from '../../../service/Flogger'
import { PlayerPayload, RoomMessage } from '../ServerMessages'
import { PlanetRoomListener } from './PlanetRoomListener'

export interface IPlanetRoomPlayerListener {

}

export class PlanetRoomPlayerListener implements IPlanetRoomPlayerListener {
    parentListener: PlanetRoomListener

    constructor(listener: PlanetRoomListener) {
        this.parentListener = listener
    }

    startListening() {
        Flogger.log('PlanetRoomPlayerListener', 'startListening')

        this.listenForBodyStateChange()
        this.listForDirectionChange()
    }

    private listenForBodyStateChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForBodyStateChange')
        
        this.parentListener.room.onMessage(RoomMessage.PlayerBodyStateChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerBodyStateChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listForDirectionChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForDirectionChange')

        this.parentListener.room.onMessage(RoomMessage.PlayerDirectionChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerDirectionChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    applyPlayerPayloadToPlayer(key: string, payload: PlayerPayload) {
        const state = this.parentListener.room.state
        const player = state.players.get(key)

        console.log('pyld')
        console.log(payload)

        // player.x = payload.x ?? player.x
        // player.y = payload.y ?? player.y
        // player.xVel = payload.xVel ?? player.xVel
        // player.yVel = payload.yVel ?? player.yVel
        player.bodyState = payload.bodyState
        player.direction = payload.direction
        player.walkingDirection = payload.walkingDirection

        console.log('direction')
        console.log(player.direction)
    }
}
