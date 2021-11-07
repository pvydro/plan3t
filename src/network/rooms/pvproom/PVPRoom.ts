import { PVPGameRoomState } from '../../schema/pvpgamestate/PVPGameRoomState'
import { GameRoom, IGameRoom } from '../GameRoom'

export interface IPVPRoom extends IGameRoom {

}

export class PVPRoom extends GameRoom implements IPVPRoom {
    initialize() {
        this.setState(new PVPGameRoomState())

        super.initialize()
    }
}
