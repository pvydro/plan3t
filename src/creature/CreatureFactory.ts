import { Creature, CreatureType } from './Creature'
import { Koini } from './koini/Koini'
import { PassiveHornet } from './passivehornet/PassiveHornet'

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
            case CreatureType.PassiveHornet:
                creature = new PassiveHornet()
                break
        }

        if (creature === undefined) {
            throw new Error('Failed to get creature for type: ' + type)
        }

        return creature
    }
}
