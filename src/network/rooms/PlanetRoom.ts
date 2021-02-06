import { Flogger } from '../../service/Flogger'
import { Room, Client } from 'colyseus'
import { Entity } from './Entity'
import { PlanetGameState } from '../schema/PlanetGameState'
import { PlanetSphericalSchema, PlanetSphericalTile, PlanetSphericalTileData } from '../schema/PlanetGameState'
import { ClientMessage, RoomMessage } from './ServerMessages'
import { DimensionSchema } from '../schema/DimensionSchema'
// import { SphericalData } from '../../gamemap/spherical/SphericalData'

interface SphericalDataMessage {
  planet: any
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
    this.onMessage(RoomMessage.NewPlanet, (client: Client, message: SphericalDataMessage) => {
      Flogger.log('PlanetRoom', 'Secured new spherical data.', 'message', message)

      try {
        if (this.planet === undefined) {
          this.planet = this.convertFetchedPlanetToSchema(message.planet)
        } else {
          Flogger.log('PlanetRoom', client.sessionId + ' tried to set new planet, but planet already set.')
        }
  
        this.state.planetSpherical = this.planet
      } catch(error) {
        Flogger.error('PlanetRoom', 'Error settings planetSpherical schema', 'error', error)
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

  private convertFetchedPlanetToSchema(planet: any) {
    const parsedPoints: PlanetSphericalTile[] = []

    // Parse points into PlanetSphericalTile schema
    for (var i in planet.points) {
      const point = planet.points[i]
      parsedPoints.push(new PlanetSphericalTile({
        x: point.x, y: point.x, tileSolidity: point.tileSolidity,
        tileValue: new PlanetSphericalTileData({
          r: point.tileValue.r,
          g: point.tileValue.g,
          b: point.tileValue.b,
          a: point.tileValue.a,
        })
      }))
    }

    // Parse new data into PlanetSphericalSchema
    return new PlanetSphericalSchema({
      biome: planet.biome,
      dimension: new DimensionSchema({
        width: planet.dimension.width,
        height: planet.dimension.height,
      }),
      points: parsedPoints
    })  
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
