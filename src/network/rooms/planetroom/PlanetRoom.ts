import { Flogger } from '../../../service/Flogger'
import { Room, Client } from 'colyseus'
import { PlanetGameState } from '../../schema/planetgamestate/PlanetGameState'
import { PlanetSphericalSchema } from '../../schema/planetgamestate/PlanetGameState'
import { IPlanetRoomListener, PlanetRoomListener } from './PlanetRoomListener'
import { IPlanetRoomAssertionService, PlanetRoomAssertionService } from './assertion/PlanetRoomAssertionService'

export interface IPlanetRoom {

}

export class PlanetRoom extends Room<PlanetGameState> implements IPlanetRoom {
  static Delta: number = 1
  listener!: IPlanetRoomListener
  assertionService!: IPlanetRoomAssertionService
  planet?: PlanetSphericalSchema = undefined

  onCreate() {
    this.listener = new PlanetRoomListener(this)
    this.assertionService = new PlanetRoomAssertionService(this)
    this.setState(new PlanetGameState())
    
    // Internal services
    this.state.initialize()
    this.listener.startListening()
    this.assertionService.startLoopingAssertion()

    // Server-side game loop
    this.setSimulationInterval((deltaTime: number) => {
      PlanetRoom.Delta = (deltaTime * 60 / 1000)

      this.state.update()
      this.assertionService.update()
    })
  }

  onJoin(client: Client, options: any) {
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player joined.')

    this.state.createPlayer(client.sessionId)
  }

  onLeave(client: Client) {
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player left.')

    const entity = this.state.players[client.sessionId]

    if (entity) { entity.dead = true }
  }

  onStateChange() {
    Flogger.log('PlanetRoom', 'State changed.')

  }
}
