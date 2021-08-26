import { Client } from 'colyseus'
import { Flogger } from '../../../service/Flogger'
import { DimensionSchema } from '../../schema/DimensionSchema'
import { PlanetSphericalSchema, PlanetSphericalTileSchema, PlanetSphericalTileDataSchema } from '../../schema/planetgamestate/PlanetSphericalSchema'
import { NewChatMessagePayload, NewPlanetMessagePayload, RoomMessage } from '../ServerMessages'
import { PlanetRoom } from './PlanetRoom'
import { PlanetRoomPlayerListener } from './PlanetRoomPlayerListener'

export interface IPlanetRoomListener {
    startListening(): void
}

export class PlanetRoomListener implements IPlanetRoomListener {
  playerListener: PlanetRoomPlayerListener

  room: PlanetRoom

  constructor(room: PlanetRoom) {
      this.room = room

      this.playerListener = new PlanetRoomPlayerListener(this)
  }

  startListening() {
      Flogger.log('PlanetRoomListener', 'startListening')

      this.playerListener.startListening()
      
      this.listenForPlanet()
      this.listenForChatMessages()
      this.listenForWaveRunnerRequests()
  }

  private listenForChatMessages() {
    Flogger.log('PlanetRoomListener', 'listenForChatMessages')

    this.room.onMessage(RoomMessage.NewChatMessage, (client: Client, message: NewChatMessagePayload) => {
      Flogger.log('PlanetRoomListener', 'Received new chat message', message)//, 'message', message)
    })
  }

  private listenForPlanet() {
    Flogger.log('PlanetRoomListener', 'listenForPlanet')

    this.room.onMessage(RoomMessage.NewPlanet, (client: Client, message: NewPlanetMessagePayload) => {
      Flogger.log('PlanetRoomListener', 'Secured new spherical data')//, 'message', message)

      try {
        if (this.room.planet === undefined) {
          this.room.planet = this.convertFetchedPlanetToSchema(message.planet)
        } else {
          Flogger.log('PlanetRoomListener', client.sessionId + ' tried to set new planet, but planet already set.')
        }
  
        this.room.state.planetSpherical = this.room.planet
        this.room.state.planetHasBeenSet = true
      } catch(error) {
        Flogger.error('PlanetRoomListener', 'Error setting planetSpherical schema', 'error', error)
      }
    })
  }

  private listenForWaveRunnerRequests() {
    Flogger.log('PlanetRoomListener', 'listenForWaveRunnerRequest')

    this.room.onMessage(RoomMessage.NewWaveRunner, (client: Client, message: any) => {
      Flogger.log('PlanetRoomListener', 'Received request for new WaveRunner')

    })
  }

  private convertFetchedPlanetToSchema(planet: any) {
    const parsedPoints: PlanetSphericalTileSchema[] = []

    // Parse points into PlanetSphericalTileSchema schema
    for (let i in planet.points) {
      const point = planet.points[i]
      parsedPoints.push(new PlanetSphericalTileSchema({
        x: point.x,
        y: point.y,
        tileSolidity: point.tileSolidity,
        tileValue: new PlanetSphericalTileDataSchema({
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
}
