import { type } from '@colyseus/schema'
import { MapBuildingType } from '../../utils/Enum'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { IServerGameState, ServerGameState } from '../serverstate/ServerGameState'

export interface IPVPGameRoomState extends IServerGameState {
    currentMap: MapBuildingType
}

export class PVPGameRoomState extends ServerGameState implements IPVPGameRoomState {
    type: string = 'pvp'
    @type('string')
    currentMap: MapBuildingType = MapBuildingType.Dojo

    initialize() {
        super.initialize()

        this.messages.add(new ChatMessageSchema().assign({ sender: '[ Server ]', text: 'New PVP' }))
    }
}
