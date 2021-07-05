import { log, logError } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'
import { RoomManager } from './RoomManager'

export interface IRoomMessenger {

}

export class RoomMessenger implements IRoomMessenger {
    static _isOnline: boolean = false

    private constructor() {}

    static send(endpoint: string | number, message: any) {
        if (DebugConstants.ShowPlayerMessengerLogs)
        log('RoomMessenger', 'send',
            'endpoint', endpoint,
            'message', message,
            'isOnline', RoomMessenger.isOnline)

        const roomManager = RoomManager.getInstance()

        if (roomManager === undefined || !RoomMessenger.isOnline) {
            logError('Tried to send message but RoomManager not initialized', 'endpoint', endpoint, 'message', message)

            return
        }

        roomManager.currentRoom.send(endpoint, message)
    }

    static sendAndExpect(endpoint: string, message: any, expectedEndpoint: string): Promise<any> {
        log('RoomMessenger', 'sendAndExpect', 'endpoint', 'expectedEndpoint')
        const roomManager = RoomManager.getInstance()

        return new Promise((resolve) => {
            this.send(endpoint, message)

            roomManager.currentRoom.onMessage(expectedEndpoint, (message: any) => {
                resolve(message)
            })
        })
    }

    static get isOnline() {
        return RoomMessenger._isOnline
    }
}
