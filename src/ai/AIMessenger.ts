import { filter, Observable } from 'rxjs'
import { RoomManager } from '../manager/roommanager/RoomManager'
import { ClientMessage } from '../network/rooms/ServerMessages'
import { IAI } from './AI'
import { AIAction, AIActionPayload } from './AIAction'

export interface IAIMessenger {
    requestAction(action: AIAction): void
    delegateAction(action: AIAction, handler: Function): void
}

export class AIMessenger implements IAIMessenger {
    ai: IAI
    actionStream$: Observable<AIActionPayload>

    constructor(ai: IAI) {
        const roomMan = RoomManager.getInstance()

        this.ai = ai
        this.actionStream$ = new Observable(observer => {
            roomMan.currentRoom.onMessage(ClientMessage.AIAction, (payload: AIActionPayload) => {
                observer.next(payload)
            })
        })
    }

    requestAction(action: AIAction) {
        
    }

    delegateAction(action: AIAction, handler: Function) {
        this.actionStream$.pipe(
            filter(a => a.action === action)
        ).subscribe(a => handler(a.data))
    }
}
