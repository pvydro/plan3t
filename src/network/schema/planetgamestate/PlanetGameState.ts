import { type } from '@colyseus/schema'
import { PlanetSphericalSchema } from './PlanetSphericalSchema'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { IServerGameState, ServerGameState } from '../serverstate/ServerGameState'

export interface IPlanetGameState extends IServerGameState {

}

export class PlanetGameState extends ServerGameState implements IPlanetGameState {
  type: string = 'planet'
  @type(PlanetSphericalSchema)
  planetSpherical?: PlanetSphericalSchema
  @type('boolean')
  planetHasBeenSet: boolean = false

  initialize() {
    super.initialize()

    this.messages.add(new ChatMessageSchema().assign({ sender: '[ Server ]', text: 'Starting...' }))
  }

  update() {
    super.update()
  }
}
