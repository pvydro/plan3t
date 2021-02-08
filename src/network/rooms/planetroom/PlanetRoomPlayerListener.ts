import { Client } from 'colyseus'
import { Flogger } from '../../../service/Flogger'
import { PlayerBodyStateChangedPayload, RoomMessage } from '../ServerMessages'
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
    }

    private listenForBodyStateChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForBodyStateChange')
        
        const state = this.parentListener.room.state

        this.parentListener.room.onMessage(RoomMessage.PlayerBodyStateChanged, (client: Client, message: PlayerBodyStateChangedPayload) => {
            Flogger.log('PlanetRoomPlayerListener', 'bodyStateChanged', 'sessionId', client.sessionId)

            // state.players.get(client.sessionId). <-- xVel, yVel // Add body state enum
        })
    }
}
