import { generateId } from 'colyseus'
import { Schema, type, MapSchema, filterChildren } from '@colyseus/schema'

import { Entity } from './Entity'
import { Player } from './Player'

export class PlanetGameState extends Schema {

  @filterChildren(function(client, key: string, value: Entity, root: PlanetGameState) {
    const currentPlayer = root.entities.get(client.sessionId);
    if (currentPlayer) {
        const a = value.x - currentPlayer.x;
        const b = value.y - currentPlayer.y;

        return (Math.sqrt(a * a + b * b)) <= 500;
    } else {
        return false;
    }
  })
  @type({ map: Entity })
  entities = new MapSchema<Entity>();

  initialize () {
  }

  createPlayer(sessionId: string) {
    this.entities.set(sessionId, new Player().assign({
      x: 0,
      y: 0
    }))
  }

  update() {
  }




  // createFood () {
  //   const food = new Entity().assign({
  //     x: Math.random() * 256,
  //     y: Math.random() * 256,
  //     radius: Math.max(4, (Math.random() * (10 - 1)))
  //   });
  //   this.entities.set(generateId(), food);
  // }

}
