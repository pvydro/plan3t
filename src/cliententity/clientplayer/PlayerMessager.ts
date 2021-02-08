import { RoomMessager } from "../../manager/roommanager/RoomMessager";
import { RoomMessage } from "../../network/rooms/ServerMessages";
import { ClientPlayer } from "./ClientPlayer";

export interface IPlayerMessager {
    send(endpoint: string, message: any): void
}

export interface PlayerMessagerOptions {
    player: ClientPlayer
}

export class PlayerMessager implements IPlayerMessager {
    player: ClientPlayer

    constructor(options: PlayerMessagerOptions) {
        this.player = options.player
    }

    send(endpoint: string, message: any) {
        RoomMessager.send(endpoint, message)
    }
}
