import { Flogger } from '../../../service/Flogger'
import { Room, Client } from 'colyseus'
import { PlanetGameState } from '../../schema/planetgamestate/PlanetGameState'
import { PlanetSphericalSchema } from '../../schema/planetgamestate/PlanetSphericalSchema'
import { IPlanetRoomListener, IRoomListenerDelegate, PlanetRoomListener } from './PlanetRoomListener'
import { PlayerSchema } from '../../schema/PlayerSchema'
import { IWaveRunnerWorker, WaveRunnerWorker } from '../../worker/WaveRunnerWorker'
import { IRoomEvent } from '../../event/RoomEvent'
import { ClientMessage, ChatMessagePayload, RoomMessage, WeaponStatusPayload } from '../ServerMessages'
import { ChatMessageSchema } from '../../schema/ChatMessageSchema'

export interface IPlanetRoom extends IRoomListenerDelegate {
  waveRunnerWorker: IWaveRunnerWorker
}

export class PlanetRoom extends Room<PlanetGameState> implements IPlanetRoom {
  static Delta: number = 1
  listener!: IPlanetRoomListener
  planet?: PlanetSphericalSchema = undefined
  waveRunnerWorker!: IWaveRunnerWorker

  onCreate() {
    this.listener = new PlanetRoomListener(this)
    this.waveRunnerWorker = new WaveRunnerWorker(this)
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
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player joined', 'options', options)

    this.state.createPlayer(client.sessionId)
  }

  onLeave(client: Client) {
    Flogger.log('PlanetRoom', 'id', client.sessionId, 'Player left')

    const entity = this.state.players[client.sessionId]

    if (entity) { entity.dead = true }
  }

  // Handlers
  handleChatEvent(event: IRoomEvent<ChatMessagePayload>) {
    Flogger.log('Planet', 'handleChatEvent', event.data)

    this.state.messages.add(new ChatMessageSchema()
      .assign(event.data))

    event.client.send(ClientMessage.UpdateChat)
  }

  handleWeaponEvent(event: IRoomEvent<WeaponStatusPayload>) {
    Flogger.log('Planet', 'handleWeaponEvent', event.data.name)
  }
}
