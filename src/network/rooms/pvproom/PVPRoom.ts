import { PVPGameState } from '../../schema/pvpgamestate/PVPGameState'
import { GameRoom, IGameRoom } from '../GameRoom'

export interface IPVPRoom extends IGameRoom {

}

export class PVPRoom extends GameRoom implements IPVPRoom {
    initialize() {
        this.setState(new PVPGameState())

        super.initialize()
    }
}
