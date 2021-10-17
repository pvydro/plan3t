import { Client } from 'colyseus'
import { Flogger } from '../../../service/Flogger'
import { ChatMessageSchema } from '../../schema/ChatMessageSchema'
import { DimensionSchema } from '../../schema/DimensionSchema'
import { PlanetSphericalSchema, PlanetSphericalTileSchema, PlanetSphericalTileDataSchema } from '../../schema/planetgamestate/PlanetSphericalSchema'
import { ClientMessage, NewChatMessagePayload, NewPlanetMessagePayload, RoomMessage } from '../ServerMessages'
import { ChatSender } from '../../../service/chatservice/ChatSenderConstants'
import { PlanetRoom } from './PlanetRoom'
import { PlanetRoomPlayerListener } from './PlanetRoomPlayerListener'
import { Emitter } from '../../../utils/Emitter'
import { of, bindCallback, Observable, map } from 'rxjs'

export interface IPlanetRoomListener {
    startListening(): void
    dispatcher: Emitter
}

export class PlanetRoomListener implements IPlanetRoomListener {
  playerListener: PlanetRoomPlayerListener
  room: PlanetRoom
  dispatcher: Emitter
  roomStream$: Observable<any>

  constructor(room: PlanetRoom) {
      this.room = room

      this.dispatcher = new Emitter()
      this.playerListener = new PlanetRoomPlayerListener(this)
      this.roomStream$ = new Observable((observer) => {
        this.dispatcher.on('roomEvent', (value) => observer.next(value))
      })

      this.roomStream$.subscribe(x => { console.log('XXXXXXX', x) })
  }

  startListening() {
      Flogger.log('PlanetRoomListener', 'startListening')

      this.playerListener.startListening()
      
      this.listenForPlanet()
      this.listenForChatMessages()
      this.listenForWaveRunnerRequests()

      this.room.onMessage('*', (client: Client, message: any) => {
        this.dispatcher.emit('roomEvent', message)
      })
  }

  private listenForChatMessages() {
    Flogger.log('PlanetRoomListener', 'listenForChatMessages')

    this.room.onMessage(RoomMessage.NewChatMessage, (client: Client, message: NewChatMessagePayload) => {
      Flogger.log('PlanetRoomListener', 'Received new chat message', message)//, 'message', message)

      this.room.state.messages.add(new ChatMessageSchema().assign({
        sender: message.sender,
        text: message.text
      }))
      
      this.room.send(client, ClientMessage.UpdateChat, this.room.state.messages)
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

    this.room.onMessage(RoomMessage.NewWaveRunner, (client: Client) => {
      Flogger.log('PlanetRoomListener', 'Received request for new WaveRunner')

      this.room.state.messages.add(new ChatMessageSchema().assign({ sender: ChatSender.Server, text: 'Requesting waverunner game...' }))
      this.room.waveRunnerWorker.startWaveRunner(client)
    })

    // this.room.onMessage(ClientMessage.WaveRunnerStarted, () => {
    //   Flogger.log('PlanetRoomListener', 'Received WaveRunnerStarted')
    //   this.room.state.messages.add(new ChatMessageSchema().assign({ sender: ChatSender.Server, text: 'Wave runner game started.' }))
    // })
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
