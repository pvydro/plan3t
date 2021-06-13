import { Schema, SetSchema, MapSchema, ArraySchema, type } from '@colyseus/schema'

import { Player } from '../../rooms/Player'
import { Flogger } from '../../../service/Flogger'
import { DimensionSchema } from '../DimensionSchema'
import { IPGSPlayerController, PGSPlayerController } from './PGSPlayerController'
import { IPGSGravityController, PGSGravityController } from './PGSGravityController'
import { Entity } from '../../rooms/Entity'
import { Creature } from '../../rooms/Creature'

export class PlanetSphericalTileData extends Schema {
  @type('number')
  r!: number
  @type('number')
  g!: number
  @type('number')
  b!: number
  @type('number')
  a!: number
}

export class PlanetSphericalTile extends Schema {
  @type('number')
  x!: number
  @type('number')
  y!: number
  @type('number')
  tileSolidity!: number
  @type(PlanetSphericalTileData)
  tileValue!: PlanetSphericalTileData
}

export class PlanetSphericalSchema extends Schema {
  @type('string')
  biome!: string
  @type(DimensionSchema)
  dimension!: DimensionSchema
  @type([ PlanetSphericalTile ])
  points!: ArraySchema<PlanetSphericalTile>
}

export class Projectile extends Entity {
  @type('string')
  sessionId!: string
  @type('number')
  rotation!: number
  @type('number')
  velocity!: number
}

export class PlanetGameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>()
  @type({ map: Creature })
  creatures = new MapSchema<Creature>()
  @type(PlanetSphericalSchema)
  planetSpherical?: PlanetSphericalSchema
  @type('boolean')
  planetHasBeenSet: boolean = false
  @type({ set: Projectile })
  projectiles = new SetSchema<Projectile>()
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

    this.players.set(sessionId, new Player().assign({
      x: x ?? 0,
      y: y ?? 0,
      xVel: 0,
      yVel: 0
    }))
  }

  createProjectile(projectile: Projectile) {
    this.projectiles.add(new Projectile().assign({
      x: projectile.x,
      y: projectile.y,
      rotation: projectile.rotation,
      velocity: projectile.velocity,
      sessionId: projectile.sessionId
    }))
  }

  update() {
    // TODO: Instead of updating these in the state, update these outside, setting the state.

    if (this.playerController) this.playerController.update()
    if (this.gravityController) this.gravityController.update()
  }
}
