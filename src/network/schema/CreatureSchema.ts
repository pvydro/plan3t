import { type } from '@colyseus/schema'
import { IVector2 } from '../../engine/math/Vector2'
import { CreatureType } from '../utils/Enum'
import { EntitySchema } from './EntitySchema'
import { Vector2Schema } from './MiscSchema'

export class CreatureSchema extends EntitySchema {
    @type('string')
    creatureType: CreatureType = CreatureType.Sorm
    // @type(Vector2Schema)
    // currentNode!: IVector2

    update(deltaTime: number) {
        // console.log('creature.x' + this.x)
        // if (this.currentNode) {
        //     if (this.currentNode.x > this.x) {
        //         this.xVel = 0.25
        //     } else if (this.currentNode.x < this.x) {
        //         this.xVel = -0.25
        //     }
        // }

        // this.x += this.xVel * deltaTime

    }
}
