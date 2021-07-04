import { Schema, SetSchema, MapSchema, ArraySchema, type } from '@colyseus/schema'

import { PlayerSchema } from '../PlayerSchema'
import { Flogger } from '../../../service/Flogger'
import { IPGSPlayerController, PGSPlayerController } from './PGSPlayerController'
import { IPGSGravityController, PGSGravityController } from './PGSGravityController'
import { ProjectileSchema } from '../ProjectileSchema'
import { PlanetSphericalSchema } from './PlanetSphericalSchema'
import { CreatureSchema } from '../CreatureSchema'

export class PlanetGameState extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>()
  @type({ map: CreatureSchema })
  creatures = new MapSchema<CreatureSchema>()
  @type(PlanetSphericalSchema)
  planetSpherical?: PlanetSphericalSchema
  @type('boolean')
  planetHasBeenSet: boolean = false
  @type({ set: ProjectileSchema })
  projectiles = new SetSchema<ProjectileSchema>()
  @type('string')
  hostId: string = ''

  playerController!: IPGSPlayerController
  gravityController!: IPGSGravityController

  initialize () {
    this.playerController = new PGSPlayerController(this)
    this.gravityController = new PGSGravityController(this)
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

  }

  update() {
    // TODO: Instead of updating these in the state, update these outside, setting the state.

    if (this.playerController) this.playerController.update()
    if (this.gravityController) this.gravityController.update()
  }
}
