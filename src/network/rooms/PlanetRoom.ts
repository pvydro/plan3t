import { Flogger } from '../../service/Flogger'
import { Room, Client } from 'colyseus'
import { Entity } from './Entity'
import { PlanetGameState } from '../schema/PlanetGameState'
import { PlanetSphericalSchema } from '../schema/PlanetGameState'
import { ClientMessage, RoomMessage } from './ServerMessages'

interface MouseMessage {
  x: number
  y: number
}

export class PlanetRoom extends Room<PlanetGameState> {
  planet?: PlanetSphericalSchema = undefined

  onCreate() {

    this.setState(new PlanetGameState())
    this.state.initialize()

    this.listenForPlanetFetch()

    this.setSimulationInterval(() => this.state.update())
  }

  listenForPlanetFetch() {
    // Receiving planet
    this.onMessage(RoomMessage.NewPlanet, (client: Client, planet: any) => {//PlanetSphericalSchema) => {
      Flogger.log('PlanetRoom', 'Secured new spherical data.', 'planet', planet)

      if (this.planet === undefined) {
        this.planet = planet

        this.state.planetSpherical = planet
      } else {
        Flogger.log('PlanetRoom', client.sessionId + ' tried to set new planet, but planet already set.')
      }
    })

    // this.onMessage(RoomMessage.GetPlanet, (client: Client) => {
    //   if (this.planet !== undefined) {
    //     Flogger.log('PlanetRoom', 'Sending servers planet to ' + client.sessionId + '.')

    //     client.send(ClientMessage.ServerHasPlanet, this.planet)
    //   } else {
    //     Flogger.log('PlanetRoom', client.sessionId + ' requested planet, but need new planet. Sending back.')

    //     client.send(ClientMessage.NeedNewPlanet)
    //   }
    // })
  }

  onJoin(client: Client, options: any) {
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player joined.')

    this.state.createPlayer(client.sessionId)
  }

  onLeave(client: Client) {
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player left.')

    const entity = this.state.entities[client.sessionId]

    if (entity) { entity.dead = true }
  }

  onStateChange() {

  }

}
