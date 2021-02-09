import { Flogger } from '../../../service/Flogger'
import { Room, Client } from 'colyseus'
import { Entity } from '../Entity'
import { PlanetGameState } from '../../schema/planetgamestate/PlanetGameState'
import { PlanetSphericalSchema, PlanetSphericalTile, PlanetSphericalTileData } from '../../schema/planetgamestate/PlanetGameState'
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
