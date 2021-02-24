import { Creature, CreatureOptions } from '../PassiveCreature'

export interface IKoini {

}

export interface KoiniOptions extends CreatureOptions {

}

export class Koini extends Creature implements IKoini {
    constructor(options: KoiniOptions) {
        super(options)
    }
}
