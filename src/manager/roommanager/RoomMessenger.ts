import { log, logError } from '../../service/Flogger'
import { matchMaker } from '../../shared/Dependencies'
import { DebugConstants } from '../../utils/Constants'

export interface IRoomMessenger {

}

export class RoomMessenger implements IRoomMessenger {
    private constructor() {}

    static send(endpoint: string | number, message: any) {
        const isOnline = matchMaker.currentRoom?.state !== undefined

        if (DebugConstants.ShowPlayerMessengerLogs) log('RoomMessenger', 'send', 'endpoint', endpoint, 'message', message, 'isOnline', isOnline)

        if (!isOnline) {
            logError('Tried to send message but Room not initialized', 'endpoint', endpoint, 'message', message)

            return
        }

        matchMaker.currentRoom.send(endpoint, message)
    }

    static sendAndExpect(endpoint: string, message: any, expectedEndpoint: string): Promise<any> {
        log('RoomMessenger', 'sendAndExpect', 'endpoint', 'expectedEndpoint')

        return new Promise((resolve) => {
            this.send(endpoint, message)

            matchMaker.currentRoom.onMessage(expectedEndpoint, (message: any) => {
                resolve(message)
            })
        })
    }
}
