import { Flogger } from '../../../service/Flogger'
import { PlanetGameState } from '../../schema/planetgamestate/PlanetGameState'
import { PlanetSphericalSchema } from '../../schema/planetgamestate/PlanetSphericalSchema'
import { IWaveRunnerWorker, WaveRunnerWorker } from '../../worker/WaveRunnerWorker'
import { IRoomEvent } from '../../event/RoomEvent'
import { WeaponStatusPayload } from '../ServerMessages'
import { GameRoom, IGameRoom } from '../GameRoom'

export interface IPlanetRoom extends IGameRoom {
  waveRunnerWorker: IWaveRunnerWorker
}

export class PlanetRoom extends GameRoom implements IPlanetRoom {
  static Delta: number = 1
  planet?: PlanetSphericalSchema = undefined
  waveRunnerWorker!: IWaveRunnerWorker

  initialize() {
    this.waveRunnerWorker = new WaveRunnerWorker(this)
    
    this.setState(new PlanetGameState())
    this.listener.startListening()

    super.initialize()
  }

  handleWeaponEvent(event: IRoomEvent<WeaponStatusPayload>) {
    Flogger.log('PlanetRoom', 'handleWeaponEvent', event.data.name)
  }
}
