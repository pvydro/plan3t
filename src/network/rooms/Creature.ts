import { type } from '@colyseus/schema'
import { CreatureType } from '../utils/Enum'
import { Entity } from './Entity'


export class Creature extends Entity {
    @type('string')
    creatureType: CreatureType = CreatureType.Sorm
}
