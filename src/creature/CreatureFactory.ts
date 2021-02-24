import { Creature, CreatureType } from './Creature'
import { Koini } from './koini/Koini'

export interface ICreatureFactory {
    createCreatureForType(type: CreatureType): Creature
}

export class CreatureFactory implements ICreatureFactory {
    constructor() {

    }

    createCreatureForType(type: CreatureType): Creature {
        let creature = undefined

        switch (type) {
            case CreatureType.Koini:
                creature = new Koini()
                break
        }

        if (creature === undefined) {
            throw new Error('Failed to get creature for type: ' + type)
        }

        return creature
    }
}
