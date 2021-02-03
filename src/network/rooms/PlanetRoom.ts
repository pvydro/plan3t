import { Flogger } from '../../service/Flogger'
import { Room, Client } from 'colyseus'
import { Entity } from './Entity'
import { PlanetGameState } from '../schema/PlanetGameState'

interface MouseMessage {
  x: number
  y: number
}

export class ArenaRoom extends Room<PlanetGameState> {

  onCreate() {

    this.setState(new PlanetGameState())
    this.state.initialize()

    // this.onMessage('mouse', (client, message: MouseMessage) => {
    //   const entity = this.state.entities[client.sessionId]
    // })

    this.setSimulationInterval(() => this.state.update())
  }

  onJoin(client: Client, options: any) {
    Flogger.log('PlanetRoom', 'Player joined', 'id', client.sessionId)

    this.state.createPlayer(client.sessionId)
  }

  onLeave(client: Client) {
    Flogger.log('PlanetRoom', 'Player left', 'id', client.sessionId)

    const entity = this.state.entities[client.sessionId]

    if (entity) { entity.dead = true }
  }

  onStateChange() {

  }

}
