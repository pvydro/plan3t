import { filter, Observable } from 'rxjs'
import { IRoomManager, RoomManager } from '../manager/roommanager/RoomManager'
import { ClientMessage, RoomMessage } from '../network/rooms/ServerMessages'
import { IAI } from './AI'
import { AIAction, AIActionData, AIActionPayload } from './AIAction'

export interface IAIMessenger {
    requestAction(action: AIAction): void
    delegateAction(action: AIAction, handler: Function): void
}

export class AIMessenger implements IAIMessenger {
    roomMan: IRoomManager
    ai: IAI
    actionStream$: Observable<AIActionPayload>

    constructor(ai: IAI) {
        this.roomMan = RoomManager.getInstance()
        this.ai = ai
        this.actionStream$ = new Observable(observer => {
            this.roomMan.currentRoom.onMessage(ClientMessage.AIAction, (payload: AIActionPayload) => {
                observer.next(payload)
            })
        })
    }

    requestAction(action: AIAction, data?: AIActionData) {
        this.roomMan.currentRoom.send(RoomMessage.AIAction, { action, data })
    }

    delegateAction(action: AIAction, handler: Function) {
        this.actionStream$.pipe(
            filter(a => a.action === action)
        ).subscribe(a => handler(a.data))
    }
}
