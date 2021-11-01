import { Client } from 'colyseus'
import { log } from '../../service/Flogger'
import { ChatMessagePayload, PlayerPayload, RoomMessage, WeaponStatusPayload } from './ServerMessages'
import { IRoomEvent, RoomEvent } from '../event/RoomEvent'
import { Observable, iif, of } from 'rxjs'
import { filter, mapTo } from 'rxjs/operators'
import { IGameRoom } from './GameRoom'
import { AIActionPayload } from '../../ai/AIAction'

export interface IGameRoomListener {
  startListening(): void
}

export interface IRoomListenerDelegate {
  handleChatEvent(event: IRoomEvent<ChatMessagePayload>): void
  handleWeaponEvent(event: IRoomEvent<WeaponStatusPayload>): void
  handlePlayerEvent(event: IRoomEvent<PlayerPayload>): void
  handleAIActionEvent(event: IRoomEvent<AIActionPayload>): void
}

export class GameRoomListener implements IGameRoomListener {
  delegate: IGameRoom
  roomStream$: Observable<RoomEvent<any>>

  constructor(delegate: IGameRoom) {
    this.delegate = delegate
    this.roomStream$ = new Observable(observer => {
      this.delegate.onMessage('*', (client: Client, type: string | number, message: any) => {
        observer.next(this.buildRoomEvent(type, message, client))
      })
    })
  }

  startListening() {
    log('GameRoomListener', 'startListening')

    this.delegateMessage(RoomMessage.NewChatMessage, this.delegate.handleChatEvent)
    this.delegateMessage(RoomMessage.PlayerShoot, this.delegate.handleWeaponEvent)
    this.delegateMessage(RoomMessage.PlayerUpdate, this.delegate.handlePlayerEvent)
    // this.delegateMessage(RoomMessage.AIAction, this.delegate.handleAIActionEvent)
    // this.roomStream$.subscribe((ev: IRoomEvent<any>) => {
    //   console.log('ROOMSTRE' + ev.type)

    //   // if (ev.type === message) {
    //   //   console.log('DELE' + ev.type)
    //   //   delegate(ev)
    //   // }
    // })
  }

  buildRoomEvent(type: string | number, message: any, client: Client) {
    const event = new RoomEvent(type as RoomMessage, message, client)

    return event
  }

  delegateMessage(message: RoomMessage, delegate: Function) {
    log('GameRoomListener', 'Delegating message type', message)

    delegate = delegate.bind(this.delegate)

    this.roomStream$.pipe(
      filter((ev: IRoomEvent<any>) => ev.type === message)
    ).subscribe((ev: IRoomEvent<any>) => delegate(ev))
  }
}

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
