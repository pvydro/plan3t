import { generateId } from 'colyseus'
import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'

import { Entity } from '../rooms/Entity'
import { Player } from '../rooms/Player'
import { Flogger } from '../../service/Flogger'

class DimensionSchema extends Schema {
  @type('number')
  width!: number
  @type('number')
  height!: number
}

class PlanetSphericalTileData extends Schema {
  @type('number')
  r!: number
  @type('number')
  g!: number
  @type('number')
  b!: number
  @type('number')
  a!: number
}

class PlanetSphericalTile extends Schema {
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
  @type({ map: Entity })
  entities = new MapSchema<Entity>()
  @type(PlanetSphericalSchema)
  planetSpherical: PlanetSphericalSchema = new PlanetSphericalSchema()

  initialize () {
    this.planetSpherical = new PlanetSphericalSchema()
  }

  createPlayer(sessionId: string) {
    Flogger.log('PlanetGameState', 'createPlayer', 'sessionId', sessionId)

    this.entities.set(sessionId, new Player().assign({
      x: 0,
      y: 0
    }))
  }

  update() {
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
