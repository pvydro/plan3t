import { Client } from 'colyseus'
import { RoomMessage } from '../rooms/ServerMessages'

export interface IRoomEvent<T> {

}

export class RoomEvent<T> implements IRoomEvent<T> {
    type: RoomMessage
    data: T
    client: Client

    constructor(type: RoomMessage, data: T, client: Client) {
        this.type = type
        this.data = data
        this.client = client
    }
}
