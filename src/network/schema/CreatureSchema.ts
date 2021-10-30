import { type } from '@colyseus/schema'
import { CreatureType } from '../utils/Enum'
import { EntitySchema } from './EntitySchema'

export class CreatureSchema extends EntitySchema {
    @type('string')
    creatureType: CreatureType = CreatureType.Sorm

    update(deltaTime: number) {
        this.xVel = 0.25
        this.x += this.xVel * deltaTime
        // console.log('creature.x' + this.x)
    }
}
