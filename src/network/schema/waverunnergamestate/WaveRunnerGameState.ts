import { type } from '@colyseus/schema'
import { log } from '../../../service/Flogger'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { WaveRunnerSchema } from '../waverunnergamestate/WaveRunnerSchema'
import { IServerGameState, ServerGameState } from '../serverstate/ServerGameState'

export interface IWaveRunnerGameState extends IServerGameState {
  waveRunner: WaveRunnerSchema
}

export class WaveRunnerGameState extends ServerGameState implements IWaveRunnerGameState {
  type: string = 'waverunner'
  @type(WaveRunnerSchema)
  waveRunner: WaveRunnerSchema = new WaveRunnerSchema(this)
  @type('boolean')
  waveGameHasStarted: boolean = false

  initialize() {
    super.initialize()

    this.messages.add(new ChatMessageSchema().assign({ sender: '[ Server ]', text: 'Starting...' }))
  }

  beginWaveRunnerGame() {
    log('WaveRunnerGameState', 'beginWaveRunnerGame')

  }

  update() {
    super.update()
    this.waveRunner.update()
  }
}
