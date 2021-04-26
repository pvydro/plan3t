import { SormEnemy } from '../enemy/sorm/SormEnemy'
import { Creature, CreatureType } from '../creature/Creature'
import { Koini } from '../creature/koini/Koini'
import { PassiveHornet } from '../creature/passivehornet/PassiveHornet'

export interface ICreatureFactory {
    createCreatureForType(type: CreatureType): Creature
}

export class CreatureFactory implements ICreatureFactory {
    constructor() {

    }

    createCreatureForType(type: CreatureType): Creature {
        let creature = undefined

        switch (type) {
            // PassiveCreatures
            case CreatureType.Koini:
                creature = new Koini()
                break
            case CreatureType.PassiveHornet:
                creature = new PassiveHornet()
                break

            // Enemies
            case CreatureType.Sorm:
                creature = new SormEnemy()
                break
        }

        if (creature === undefined) {
            throw new Error('Failed to get creature for type: ' + type)
        }

        return creature
    }
}
