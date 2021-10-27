import { Flogger } from '../../../service/Flogger'
import { PlanetGameState } from '../../schema/planetgamestate/PlanetGameState'
import { IRoomEvent } from '../../event/RoomEvent'
import { WeaponStatusPayload } from '../ServerMessages'
import { GameRoom, IGameRoom } from '../GameRoom'

export interface IPlanetRoom extends IGameRoom {

}

export class PlanetRoom extends GameRoom implements IPlanetRoom {
  initialize() {
    this.setState(new PlanetGameState())

    super.initialize()
  }

  handleWeaponEvent(event: IRoomEvent<WeaponStatusPayload>) {
    Flogger.log('PlanetRoom', 'handleWeaponEvent', event.data.name)

    super.handleWeaponEvent(event)
  }
}
