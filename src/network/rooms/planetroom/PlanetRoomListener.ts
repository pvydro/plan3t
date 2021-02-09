import { Client } from 'colyseus'
import { Flogger } from '../../../service/Flogger'
import { DimensionSchema } from '../../schema/DimensionSchema'
import { PlanetSphericalSchema, PlanetSphericalTile, PlanetSphericalTileData } from '../../schema/planetgamestate/PlanetGameState'
import { NewPlanetMessagePayload, RoomMessage } from '../ServerMessages'
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

    private convertFetchedPlanetToSchema(planet: any) {
        const parsedPoints: PlanetSphericalTile[] = []
    
        // Parse points into PlanetSphericalTile schema
        for (var i in planet.points) {
          const point = planet.points[i]
          parsedPoints.push(new PlanetSphericalTile({
            x: point.x,
            y: point.y,
            tileSolidity: point.tileSolidity,
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
}
