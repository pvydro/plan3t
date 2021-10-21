import { IWaveRunnerWorker, WaveRunnerWorker } from '../../worker/WaveRunnerWorker'
import { GameRoom, IGameRoom } from '../GameRoom'
import { WaveRunnerGameState } from '../../schema/waverunnergamestate/WaveRunnerGameState'

export interface IWaveRunnerRoom extends IGameRoom {
  waveRunnerWorker: IWaveRunnerWorker
}

export class WaveRunnerRoom extends GameRoom implements IWaveRunnerRoom {
  waveRunnerWorker!: IWaveRunnerWorker

  initialize() {
    this.waveRunnerWorker = new WaveRunnerWorker(this)
    
    this.setState(new WaveRunnerGameState())

    super.initialize()
  }
}
