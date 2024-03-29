import { filter, Observable } from 'rxjs'
import { ClientMessage, RoomMessage } from '../network/rooms/ServerMessages'
import { IAI } from './AI'
import { AIAction, AIActionData, AIActionPayload } from './AIAction'
import { Environment } from '../main/Environment'
import { matchMaker } from '../shared/Dependencies'

export interface IAIMessenger {
    requestAction(action: AIAction): void
    delegateAction(action: AIAction, handler: Function): void
}

export class AIMessenger implements IAIMessenger {
    ai: IAI
    actionStream$: Observable<AIActionPayload>

    constructor(ai: IAI) {
        this.ai = ai
        this.actionStream$ = new Observable(observer => {
            matchMaker.currentRoom.onMessage(ClientMessage.AIAction, (payload: AIActionPayload) => {
                observer.next(payload)
            })
        })
    }

    requestAction(action: AIAction, data?: AIActionData) {
        if (!Environment.isHost) return

        const actionData: AIActionData = data || { entityID: this.ai.target.entityId }
        const payload: AIActionPayload = { action, actionData }
        matchMaker.currentRoom.send(RoomMessage.AIAction, payload)
    }

    delegateAction(action: AIAction, handler: Function) {
        this.actionStream$.pipe(
            filter(a => a.action === action)
        ).subscribe(a => handler(a.actionData))
    }
}
