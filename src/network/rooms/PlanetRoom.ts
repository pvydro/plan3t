import { Flogger } from '../../service/Flogger'
import { Room, Client } from 'colyseus'
import { Entity } from './Entity'
import { PlanetGameState } from '../schema/PlanetGameState'
import { PlanetSphericalSchema } from '../schema/PlanetGameState'

interface MouseMessage {
  x: number
  y: number
}

export class ArenaRoom extends Room<PlanetGameState> {

  onCreate() {

    this.setState(new PlanetGameState())
    this.state.initialize()

    this.onMessage('newPlanet', (client: Client, message: any) => {
      Flogger.log('PlanetRoom', 'Secured new spherical data', 'message', message)
    })

    this.setSimulationInterval(() => this.state.update())
  }

  onJoin(client: Client, options: any) {
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player joined')

    this.state.createPlayer(client.sessionId)
  }

  onLeave(client: Client) {
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player left')

    const entity = this.state.entities[client.sessionId]

    if (entity) { entity.dead = true }
  }

  onStateChange() {

  }

}
