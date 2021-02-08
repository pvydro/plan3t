import { Flogger } from '../../../service/Flogger'
import { Room, Client } from 'colyseus'
import { Entity } from '../Entity'
import { PlanetGameState } from '../../schema/PlanetGameState'
import { PlanetSphericalSchema, PlanetSphericalTile, PlanetSphericalTileData } from '../../schema/PlanetGameState'
import { RoomMessage, NewPlanetMessagePayload } from '../ServerMessages'
import { DimensionSchema } from '../../schema/DimensionSchema'
import { PlanetRoomListener } from './PlanetRoomListener'
// import { SphericalData } from '../../gamemap/spherical/SphericalData'

export interface IPlanetRoom {

}

export class PlanetRoom extends Room<PlanetGameState> implements IPlanetRoom {
  listener!: PlanetRoomListener
  planet?: PlanetSphericalSchema = undefined

  onCreate() {

    this.listener = new PlanetRoomListener(this)

    this.setState(new PlanetGameState())
    this.state.initialize()

    this.listener.startListening()

    this.setSimulationInterval(() => this.state.update())
  }

  // listenForPlanetFetch() {
  //   // Receiving planet
  //   this.onMessage(RoomMessage.NewPlanet, (client: Client, message: NewPlanetMessagePayload) => {
  //     Flogger.log('PlanetRoom', 'Secured new spherical data', 'message', message)

  //     try {
  //       if (this.planet === undefined) {
  //         this.planet = this.convertFetchedPlanetToSchema(message.planet)
  //       } else {
  //         Flogger.log('PlanetRoom', client.sessionId + ' tried to set new planet, but planet already set.')
  //       }
  
  //       this.state.planetSpherical = this.planet
  //       this.state.planetHasBeenSet = true
  //     } catch(error) {
  //       Flogger.error('PlanetRoom', 'Error settings planetSpherical schema', 'error', error)
  //     }
  //   })
  // }

  // private convertFetchedPlanetToSchema(planet: any) {
  //   const parsedPoints: PlanetSphericalTile[] = []

  //   // Parse points into PlanetSphericalTile schema
  //   for (var i in planet.points) {
  //     const point = planet.points[i]
  //     parsedPoints.push(new PlanetSphericalTile({
  //       x: point.x,
  //       y: point.y,
  //       tileSolidity: point.tileSolidity,
  //       tileValue: new PlanetSphericalTileData({
  //         r: point.tileValue.r,
  //         g: point.tileValue.g,
  //         b: point.tileValue.b,
  //         a: point.tileValue.a,
  //       })
  //     }))
  //   }

  //   // Parse new data into PlanetSphericalSchema
  //   return new PlanetSphericalSchema({
  //     biome: planet.biome,
  //     dimension: new DimensionSchema({
  //       width: planet.dimension.width,
  //       height: planet.dimension.height,
  //     }),
  //     points: parsedPoints
  //   })  
  // }

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
    Flogger.log('PlanetRoom', 'State changed.')

  }
}
