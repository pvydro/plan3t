import { type } from '@colyseus/schema'
import { CreatureType } from '../utils/Enum'
import { EntitySchema } from './EntitySchema'


export class CreatureSchema extends EntitySchema {
    @type('string')
    creatureType: CreatureType = CreatureType.Sorm
}
