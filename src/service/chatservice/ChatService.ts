import { EventEmitter } from 'eventemitter3'
import { RoomManager } from '../../manager/roommanager/RoomManager'
import { RoomMessenger } from '../../manager/roommanager/RoomMessenger'
import { RoomStateManager } from '../../manager/roommanager/RoomStateManager'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { ChatMessageSchema } from '../../network/schema/ChatMessageSchema'
import { log } from '../Flogger'
import { IChatMessage } from './ChatMessage'

export interface IChatService {

}

export enum ChatEvent {
    NewChatMessage = 'newChatMessage'
}

export class ChatService implements IChatService {
    private static _eventBus = new EventEmitter()
    // private static _messageHistory: string = `Hey\nHey\nWhat's up\nJust coding\nCool`
    private static _localMessageHistory: IChatMessage[] = [
        { sender: 'Ding', text: 'Do' },
        { sender: 'Dong', text: 'The' },
        { sender: '[ Ditch ]', text: 'Mar' },
    ]

    private constructor() {
        throw new Error('InGameChatService should not be instantiated')
    }

    static fetchChatHistoryFromRoom() {
        log('ChatService', 'fetchChatHistoryFromRoom')

        const messages = RoomManager.getInstance().roomStateManager.currentState?.messages

        if (messages) {
            this._localMessageHistory = []
            messages.forEach((message: ChatMessageSchema) => {
                this._localMessageHistory.push({ sender: message.sender, text: message.text })
            })
    
            this.eventBus.emit(ChatEvent.NewChatMessage)
        }
    }

    static sendMessage(message: IChatMessage) {
        log('ChatService', 'sendMessage', 'message', message)

        RoomMessenger.send(RoomMessage.NewChatMessage, message)

        this.fetchChatHistoryFromRoom()
    }

    static get messageLogAsString(): string {
        let str = ''

        for (var i in ChatService._localMessageHistory) {
            const message = ChatService._localMessageHistory[i]
            const messageStr = `${message.sender}: ${message.text}\n`

            str += messageStr
        }

        return str
    }

    static get eventBus() {
        return ChatService._eventBus
    }
}
