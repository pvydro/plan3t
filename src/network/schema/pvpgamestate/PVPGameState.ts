import { type } from '@colyseus/schema'
import { MapBuildingType } from '../../utils/Enum'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { IServerGameState, ServerGameState } from '../serverstate/ServerGameState'

export interface IPVPGameState extends IServerGameState {
    currentMap: MapBuildingType
}

export class PVPGameState extends ServerGameState implements IPVPGameState {
    type: string = 'pvp'
    @type('string')
    currentMap: MapBuildingType = MapBuildingType.Castle

    initialize() {
        super.initialize()

        this.messages.add(new ChatMessageSchema().assign({ sender: '[ Server ]', text: 'New PVP' }))
    }
}
