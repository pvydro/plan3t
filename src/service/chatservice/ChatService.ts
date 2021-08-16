import { EventEmitter } from 'eventemitter3'
import { RoomMessenger } from '../../manager/roommanager/RoomMessenger'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { log } from '../Flogger'
import { IChatMessage } from './ChatMessage'

export interface IChatService {

}

export class ChatService implements IChatService {
    private static _eventBus = new EventEmitter()
    private static _messageHistory: string = `Hey\nHey\nWhat's up\nJust coding\nCool`

    private constructor() {
        throw new Error('InGameChatService should not be instantiated')
    }

    static onMessageChange(callback: Function) {
        log('ChatService', 'onMessageChange')

        callback(this._messageHistory)
    }

    static sendMessage(message: IChatMessage) {
        log('ChatService', 'sendMessage', 'message', message)

        RoomMessenger.send(RoomMessage.NewChatMessage, message)
    }

    static get messageLogAsString() {
        return ChatService._messageHistory
    }
}
