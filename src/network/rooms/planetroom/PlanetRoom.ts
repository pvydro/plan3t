import { WeaponStatePack } from '../../../cliententity/clientplayer/state/WeaponStatePack'
import { Flogger } from '../../../service/Flogger'
import { IRoomEvent } from '../../event/RoomEvent'
import { GameRoom, IGameRoom } from '../GameRoom'

export interface IPlanetRoom extends IGameRoom {

}

export class PlanetRoom extends GameRoom implements IPlanetRoom {
  initialize() {
    // this.setState(new PlanetGameState())

    super.initialize()
  }

  handleWeaponEvent(event: IRoomEvent<WeaponStatePack>) {
    Flogger.log('PlanetRoom', 'handleWeaponEvent', event.data.name)

    super.handleWeaponEvent(event)
  }
}
