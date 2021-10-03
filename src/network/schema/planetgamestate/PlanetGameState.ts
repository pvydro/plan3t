import { type } from '@colyseus/schema'
import { Flogger } from '../../../service/Flogger'
import { PlanetSphericalSchema } from './PlanetSphericalSchema'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { WaveRunnerSchema } from '../waverunner/WaveRunnerSchema'
import { ServerGameState } from '../serverstate/ServerGameState'

export class PlanetGameState extends ServerGameState {
  @type(PlanetSphericalSchema)
  planetSpherical?: PlanetSphericalSchema
  @type(WaveRunnerSchema)
  waveRunner?: WaveRunnerSchema

  @type('boolean')
  planetHasBeenSet: boolean = false
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
    // TODO: Instead of updating these in the state, update these outside, setting the state.
    super.update()
    if (this.waveRunner) this.waveRunner.update()
  }
}
