import { type } from '@colyseus/schema'
import { Flogger } from '../../../service/Flogger'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { WaveRunnerSchema } from '../waverunnergamestate/WaveRunnerSchema'
import { IServerGameState, ServerGameState } from '../serverstate/ServerGameState'

export interface IWaveRunnerGameState extends IServerGameState {

}

export class WaveRunnerGameState extends ServerGameState implements IWaveRunnerGameState {
  @type(WaveRunnerSchema)
  waveRunner?: WaveRunnerSchema

  @type('boolean')
  waveGameHasBeenStarted: boolean = false

  initialize() {
    super.initialize()

    this.messages.add(new ChatMessageSchema().assign({ sender: '[ Server ]', text: 'Starting...' }))
  }

  beginWaveRunnerGame() {
    Flogger.log('PlanetGameState', 'beginWaveRunnerGame')

    this.waveRunner = new WaveRunnerSchema()
    this.waveRunner.initialize()
  }

  update() {
    super.update()
    if (this.waveRunner) this.waveRunner.update()
  }
}
