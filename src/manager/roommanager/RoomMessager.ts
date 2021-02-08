import { Flogger } from "../../service/Flogger";
import { RoomManager } from "./RoomManager";

export interface IRoomMessager {

}

export class RoomMessager implements IRoomMessager {
    static _isOnline: boolean = false

    private constructor() {}

    static send(endpoint: string | number, message: any) {
        Flogger.log('RoomMessager', 'send',
            'endpoint', endpoint,
            'message', message,
            'isOnline', RoomMessager.isOnline)

        const roomManager = RoomManager.getInstance()

        if (roomManager === undefined || !RoomMessager.isOnline) {
            Flogger.error('Tried to send message but RoomManager not initialized', 'endpoint', endpoint, 'message', message)

            return
        }

        roomManager.currentRoom.send(endpoint, message)
    }

    static get isOnline() {
        return RoomMessager._isOnline
    }
}
