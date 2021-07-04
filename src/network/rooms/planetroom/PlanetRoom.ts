import { Flogger } from '../../../service/Flogger'
import { Room, Client } from 'colyseus'
import { PlanetGameState } from '../../schema/planetgamestate/PlanetGameState'
import { PlanetSphericalSchema } from '../../schema/planetgamestate/PlanetSphericalSchema'
import { IPlanetRoomListener, PlanetRoomListener } from './PlanetRoomListener'
import { PlayerSchema } from '../../schema/PlayerSchema'

export interface IPlanetRoom {

}

export class PlanetRoom extends Room<PlanetGameState> implements IPlanetRoom {
  static Delta: number = 1
  listener!: IPlanetRoomListener
  planet?: PlanetSphericalSchema = undefined

  onCreate() {
    this.listener = new PlanetRoomListener(this)
    this.setState(new PlanetGameState())
    
    // Internal services
    this.state.initialize()
    this.listener.startListening()

    // Server-side game loop
    this.setSimulationInterval((deltaTime: number) => {
      PlanetRoom.Delta = (deltaTime * 60 / 1000)

      this.state.players.forEach((player: PlayerSchema) => {

        player.x += player.xVel * PlanetRoom.Delta
        player.y += player.yVel * PlanetRoom.Delta
        
      })

      this.state.update()
    })
  }

  onJoin(client: Client, options: any) {
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player joined.', 'options', options)

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
