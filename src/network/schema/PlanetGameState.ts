import { generateId } from 'colyseus'
import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'

import { Entity } from '../rooms/Entity'
import { PlayerBodyState, Player } from '../rooms/Player'
import { Flogger } from '../../service/Flogger'
import { DimensionSchema } from './DimensionSchema'

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

  

  initialize () {
    // this.planetSpherical = new PlanetSphericalSchema()
    this.planetHasBeenSet = false
  }

  createPlayer(sessionId: string) {
    Flogger.log('PlanetGameState', 'createPlayer', 'sessionId', sessionId)

    this.players.set(sessionId, new Player().assign({
      x: 0,
      y: 0
    }))
  }

  update() {

    const playerCrouchDivisor: number = 1.75
    const playerWalkingSpeed: number = 1.5
    const playerJumpingHeight: number = 5
    const floorFriction: number = 5

    this.players.forEach((p: Player) => {
      switch (p.bodyState) {
        case PlayerBodyState.Idle:
          break
          case PlayerBodyState.Walking:
          // p.xVel = -playerWalkingSpeed / 1//walkDivisor
          break
        case PlayerBodyState.Jumping:
          break
      }
    })
  }

  // @filterChildren(function(client, key: string, value: Entity, root: PlanetGameState) {
  //   const currentPlayer = root.entities.get(client.sessionId);
  //   if (currentPlayer) {
  //       const a = value.x - currentPlayer.x;
  //       const b = value.y - currentPlayer.y;

  //       return (Math.sqrt(a * a + b * b)) <= 500;
  //   } else {
  //       return false;
  //   }
  // })

  // createFood () {
  //   const food = new Entity().assign({
  //     x: Math.random() * 256,
  //     y: Math.random() * 256,
  //     radius: Math.max(4, (Math.random() * (10 - 1)))
  //   });
  //   this.entities.set(generateId(), food);
  // }

}
