import { ChatMessageSchema } from '../ChatMessageSchema'
import { ServerGameState } from '../serverstate/ServerGameState'

export interface IPVPGameState {
}

export class PVPGameState extends ServerGameState {
    type: string = 'pvp'

    initialize() {
        super.initialize()

        this.messages.add(new ChatMessageSchema().assign({ sender: '[ Server ]', text: 'New PVP' }))
    }
}
