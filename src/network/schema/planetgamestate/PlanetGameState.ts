import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'

import { Player } from '../../rooms/Player'
import { Flogger } from '../../../service/Flogger'
import { DimensionSchema } from '../DimensionSchema'
import { IPGSPlayerController, PGSPlayerController } from './PGSPlayerController'
import { IPGSGravityController, PGSGravityController } from './PGSGravityController'

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

export class PlanetGameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>()
  @type(PlanetSphericalSchema)
  planetSpherical?: PlanetSphericalSchema
  @type('boolean')
  planetHasBeenSet: boolean = false

  playerController!: IPGSPlayerController
  gravityController!: IPGSGravityController

  initialize () {
    this.playerController = new PGSPlayerController(this)
    this.gravityController = new PGSGravityController(this)
  }

  createPlayer(sessionId: string) {
    Flogger.log('PlanetGameState', 'createPlayer', 'sessionId', sessionId)

    this.players.set(sessionId, new Player().assign({ x: 0, y: 0 }))
  }

  update() {
    if (this.playerController) this.playerController.update()
    if (this.gravityController) this.gravityController.update()
  }
}
