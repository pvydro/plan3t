import { Flogger } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'
import { RoomManager } from './RoomManager'

export interface IRoomMessenger {

}

export class RoomMessenger implements IRoomMessenger {
    static _isOnline: boolean = false

    private constructor() {}

    static send(endpoint: string | number, message: any) {
        if (DebugConstants.ShowPlayerMessengerLogs)
        Flogger.log('RoomMessenger', 'send',
            'endpoint', endpoint,
            'message', message,
            'isOnline', RoomMessenger.isOnline)

        const roomManager = RoomManager.getInstance()

        if (roomManager === undefined || !RoomMessenger.isOnline) {
            Flogger.error('Tried to send message but RoomManager not initialized', 'endpoint', endpoint, 'message', message)

            return
        }

        roomManager.currentRoom.send(endpoint, message)
    }

    static get isOnline() {
        return RoomMessenger._isOnline
    }
}
