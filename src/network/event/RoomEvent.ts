import { Client } from 'colyseus'
import { RoomMessage } from '../rooms/ServerMessages'

export interface IRoomEvent {

}

export class RoomEvent implements IRoomEvent {
    type: RoomMessage
    data: any
    client: Client

    constructor(type: RoomMessage, data: any, client: Client) {
        this.type = type
        this.data = data
        this.client = client
    }
}
