import { Schema, SetSchema, MapSchema, ArraySchema, type } from '@colyseus/schema'

import { PlayerSchema } from '../PlayerSchema'
import { Flogger } from '../../../service/Flogger'
import { IPGSPlayerController, PGSPlayerController } from './PGSPlayerController'
import { IPGSGravityController, PGSGravityController } from './PGSGravityController'
import { ProjectileSchema } from '../ProjectileSchema'
import { PlanetSphericalSchema } from './PlanetSphericalSchema'
import { CreatureSchema } from '../CreatureSchema'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { WaveRunnerSchema } from '../waverunner/WaveRunnerSchema'

export class PlanetGameState extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>()
  @type({ map: CreatureSchema })
  creatures = new MapSchema<CreatureSchema>()
  @type({ set: ChatMessageSchema })
  messages = new SetSchema<ChatMessageSchema>()
  @type(PlanetSphericalSchema)
  planetSpherical?: PlanetSphericalSchema
  @type(WaveRunnerSchema)
  waveRunner?: WaveRunnerSchema
  @type({ set: ProjectileSchema })
  projectiles = new SetSchema<ProjectileSchema>()
  @type('string')
  hostId: string = ''

  @type('boolean')
  planetHasBeenSet: boolean = false
  @type('boolean')
  waveGameHasBeenStarted: boolean = false

  playerController!: IPGSPlayerController
  gravityController!: IPGSGravityController

  initialize() {
    this.playerController = new PGSPlayerController(this)
    this.gravityController = new PGSGravityController(this)

    this.messages.add(new ChatMessageSchema().assign({ sender: '[ Server ]', text: 'Starting...' }))
  }

  createPlayer(sessionId: string, x?: number, y?: number) {
    Flogger.log('PlanetGameState', 'createPlayer', 'sessionId', sessionId)

    if (this.hostId === '') {
      Flogger.log('PlanetGameState', 'no hostId set, assigning player as host', 'sessionId', sessionId)

      this.hostId = sessionId
    }

    this.players.set(sessionId, new PlayerSchema().assign({
      x: x ?? 0,
      y: y ?? 0,
      xVel: 0,
      yVel: 0
    }))
  }

  createCreature(schema: CreatureSchema) {

  }

  createProjectile(schema: ProjectileSchema) {
    this.projectiles.add(new ProjectileSchema().assign({
      x: schema.x,
      y: schema.y,
      rotation: schema.rotation,
      velocity: schema.velocity,
      sessionId: schema.sessionId
    }))
  }

  beginWaveRunnerGame() {
    Flogger.log('PlanetGameState', 'beginWaveRunnerGame')

    this.waveRunner = new WaveRunnerSchema()
    this.waveRunner.initialize()
  }

  update() {
    // TODO: Instead of updating these in the state, update these outside, setting the state.

    if (this.playerController) this.playerController.update()
    if (this.gravityController) this.gravityController.update()
    if (this.waveRunner) this.waveRunner.update()
  }
}
