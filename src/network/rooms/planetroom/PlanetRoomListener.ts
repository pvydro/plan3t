import { Client } from 'colyseus'
import { Flogger } from '../../../service/Flogger'
import { ChatMessageSchema } from '../../schema/ChatMessageSchema'
import { ClientMessage, NewChatMessagePayload, RoomMessage } from '../ServerMessages'
import { IPlanetRoom, PlanetRoom } from './PlanetRoom'
import { PlanetRoomPlayerListener } from './PlanetRoomPlayerListener'
import { RoomEvent } from '../../event/RoomEvent'
import { Emitter } from '../../../utils/Emitter'
import { Observable } from 'rxjs'
import { catchError, filter, finalize, map, retry, take, tap, timeout } from 'rxjs/operators'

export interface IPlanetRoomListener {
  startListening(): void
  dispatcher: Emitter
}

export interface IRoomListenerDelegate {
  handleChatEvent(event: RoomEvent): void
  handleWeaponEvent(event: RoomEvent): void
}

export class PlanetRoomListener implements IPlanetRoomListener {
  delegate: PlanetRoom
  dispatcher: Emitter
  roomStream$: Observable<RoomEvent>

  constructor(delegate: PlanetRoom) {
    this.delegate = delegate
    this.dispatcher = new Emitter()

    this.delegate.onMessage('*', (client: Client, type: string | number, message: any) => {
      this.dispatcher.emit('roomEvent', this.buildRoomEvent(type, message, client))
    })
    this.roomStream$ = new Observable((observer) => {
      this.dispatcher.on('roomEvent', (value: RoomEvent) => observer.next(value))
    })
  }

  startListening() {
    Flogger.log('PlanetRoomListener', 'startListening')

    this.delegateMessage(RoomMessage.NewChatMessage, this.delegate.handleChatEvent)
    this.delegateMessage(RoomMessage.PlayerShoot, this.delegate.handleWeaponEvent)
  }

  buildRoomEvent(type: string | number, message: any, client: Client) {
    const event = new RoomEvent(type as RoomMessage, message, client)

    return event
  }

  delegateMessage(message: RoomMessage, delegate: Function) {
    delegate = delegate.bind(this.delegate)

    this.roomStream$.pipe(
      filter((ev: RoomEvent) => ev.type === message)
    ).subscribe((ev: RoomEvent) => delegate(ev))
  }

  // handleEvent(event: RoomEvent) {
  //   Flogger.log('PlanetRoomListeners', 'handleEvent', event.type)

  //   switch (event.type) {
  //     case RoomMessage.NewChatMessage:
  //       this.delegate.handleChatEvent(event)
  //       break

  //     case RoomMessage.PlayerShoot: // TODO: Abstract PlayerShoot into WeaponUpdate
  //       this.delegate.handleWeaponEvent(event)
  //       break
  //   }
  // }

  // private listenForChatMessages() {
  //   Flogger.log('PlanetRoomListener', 'listenForChatMessages')

  //   this.delegate.onMessage(RoomMessage.NewChatMessage, (client: Client, message: NewChatMessagePayload) => {
  //     Flogger.log('PlanetRoomListener', 'Received new chat message', message)//, 'message', message)

  //     this.delegate.state.messages.add(new ChatMessageSchema().assign({
  //       sender: message.sender,
  //       text: message.text
  //     }))
      
  //     this.delegate.send(client, ClientMessage.UpdateChat, this.delegate.state.messages)
  //   })
  // }

  // private listenForWaveRunnerRequests() {
  //   Flogger.log('PlanetRoomListener', 'listenForWaveRunnerRequest')

  //   this.room.onMessage(RoomMessage.NewWaveRunner, (client: Client) => {
  //     Flogger.log('PlanetRoomListener', 'Received request for new WaveRunner')

  //     this.room.state.messages.add(new ChatMessageSchema().assign({ sender: ChatSender.Server, text: 'Requesting waverunner game...' }))
  //     this.room.waveRunnerWorker.startWaveRunner(client)
  //   })

  //   // this.room.onMessage(ClientMessage.WaveRunnerStarted, () => {
  //   //   Flogger.log('PlanetRoomListener', 'Received WaveRunnerStarted')
  //   //   this.room.state.messages.add(new ChatMessageSchema().assign({ sender: ChatSender.Server, text: 'Wave runner game started.' }))
  //   // })
  // }

  // private listenForPlanet() {
  //   Flogger.log('PlanetRoomListener', 'listenForPlanet')

  //   this.room.onMessage(RoomMessage.NewPlanet, (client: Client, message: NewPlanetMessagePayload) => {
  //     Flogger.log('PlanetRoomListener', 'Secured new spherical data')//, 'message', message)

  //     try {
  //       if (this.room.planet === undefined) {
  //         this.room.planet = this.convertFetchedPlanetToSchema(message.planet)
  //       } else {
  //         Flogger.log('PlanetRoomListener', client.sessionId + ' tried to set new planet, but planet already set.')
  //       }
  
  //       this.room.state.planetSpherical = this.room.planet
  //       this.room.state.planetHasBeenSet = true
  //     } catch(error) {
  //       Flogger.error('PlanetRoomListener', 'Error setting planetSpherical schema', 'error', error)
  //     }
  //   })
  // }

  // private convertFetchedPlanetToSchema(planet: any) {
  //   const parsedPoints: PlanetSphericalTileSchema[] = []

  //   // Parse points into PlanetSphericalTileSchema schema
  //   for (let i in planet.points) {
  //     const point = planet.points[i]
  //     parsedPoints.push(new PlanetSphericalTileSchema({
  //       x: point.x,
  //       y: point.y,
  //       tileSolidity: point.tileSolidity,
  //       tileValue: new PlanetSphericalTileDataSchema({
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
}
