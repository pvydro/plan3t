import { SormEnemy } from '../enemy/sorm/SormEnemy'
import { Creature } from '../creature/Creature'
import { Koini } from '../creature/koini/Koini'
import { PassiveHornet } from '../creature/passivehornet/PassiveHornet'
import { CreatureType } from '../creature/CreatureType'

export class CreatureFactory {
    private constructor() {

    }

    static createCreatureForType(type: CreatureType): Creature {
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
