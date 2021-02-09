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
        this.listenForLegsStateChange()
        this.listenForDirectionChange()
        this.listenForOnGroundChange()
    }

    private listenForBodyStateChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForBodyStateChange')
        
        this.parentListener.room.onMessage(RoomMessage.PlayerBodyStateChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerBodyStateChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listenForLegsStateChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForLegsStateChange')

        this.parentListener.room.onMessage(RoomMessage.PlayerBodyStateChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerBodyStateChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listenForDirectionChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForDirectionChange')

        this.parentListener.room.onMessage(RoomMessage.PlayerDirectionChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerDirectionChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listenForOnGroundChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForOnGroundChange')

        this.parentListener.room.onMessage(RoomMessage.PlayerLandedOnGround, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerLandedOnGround, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    applyPlayerPayloadToPlayer(key: string, payload: PlayerPayload) {
        const state = this.parentListener.room.state
        const player = state.players.get(key)

        // player.x = payload.x ?? player.x
        player.bodyState = payload.bodyState
        player.legsState = payload.legsState
        player.direction = payload.direction
        player.walkingDirection = payload.walkingDirection

        // Rule based properties
        if (payload.y !== undefined) player.y = payload.y
        if (payload.xVel !== undefined) player.xVel = payload.xVel
        if (payload.yVel !== undefined) player.yVel = payload.yVel
    }
}
