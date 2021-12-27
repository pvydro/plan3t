import { type } from '@colyseus/schema'
import { MapBuildingType } from '../../utils/Enum'
import { log } from '../../../service/Flogger'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { IServerGameState, ServerGameState } from '../serverstate/ServerGameState'

export interface IPVPGameRoomState extends IServerGameState {
    currentMap: MapBuildingType
    pvpGameHasStarted: boolean
    mapFloors: number
}

export class PVPGameRoomState extends ServerGameState implements IPVPGameRoomState {
    type: string = 'pvp'
    @type('string')
    currentMap: MapBuildingType = MapBuildingType.Dojo
    @type('number')
    mapFloors: number = 3
    @type('boolean')
    pvpGameHasStarted: boolean = false

    initialize() {
        super.initialize()

        this.messages.add(new ChatMessageSchema().assign({ sender: 'Server', text: 'New PVP' }))
    }

    beginPVPGame() {
        log('PVPGameRoomState', 'beginPVPGame')

        this.pvpGameHasStarted = true
    }


}
