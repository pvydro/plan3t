import { SormEnemy } from '../enemy/sorm/SormEnemy'
import { Creature } from '../creature/Creature'
import { Koini } from '../creature/koini/Koini'
import { PassiveFly } from '../creature/passivefly/PassiveFly'
import { CreatureType } from '../creature/CreatureType'
import { NenjEnemy } from '../enemy/nenj/NenjEnemy'
import { TorkEnemy } from '../enemy/tork/TorkEnemy'

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
                creature = new PassiveFly()
                break

            // Enemies
            case CreatureType.Sorm:
                creature = new SormEnemy()
                break
            case CreatureType.Nenj:
                creature = new NenjEnemy()
                break
            case CreatureType.Tork:
                creature = new TorkEnemy()
                break
        }

        if (creature === undefined) {
            throw new Error('Failed to get creature for type: ' + type)
        }

        return creature
    }
}
