import { Flogger } from '../../../service/Flogger'
import { PlanetGameState } from '../../schema/planetgamestate/PlanetGameState'
import { PlanetSphericalSchema } from '../../schema/planetgamestate/PlanetSphericalSchema'
import { IPlanetRoomListener, IRoomListenerDelegate, GameRoomListener } from './PlanetRoomListener'
import { IWaveRunnerWorker, WaveRunnerWorker } from '../../worker/WaveRunnerWorker'
import { IRoomEvent } from '../../event/RoomEvent'
import { WeaponStatusPayload } from '../ServerMessages'
import { GameRoom } from '../GameRoom'

export interface IPlanetRoom extends IRoomListenerDelegate {
  waveRunnerWorker: IWaveRunnerWorker
}

export class PlanetRoom extends GameRoom implements IPlanetRoom {
  static Delta: number = 1
  listener!: IPlanetRoomListener
  planet?: PlanetSphericalSchema = undefined
  waveRunnerWorker!: IWaveRunnerWorker

  initialize() {
    this.listener = new GameRoomListener(this)
    this.waveRunnerWorker = new WaveRunnerWorker(this)
    
    this.setState(new PlanetGameState())
    this.listener.startListening()

    super.initialize()
  }

  handleWeaponEvent(event: IRoomEvent<WeaponStatusPayload>) {
    Flogger.log('PlanetRoom', 'handleWeaponEvent', event.data.name)
  }
}
