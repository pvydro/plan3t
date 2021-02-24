import { Creature, CreatureOptions } from '../Creature'

export interface IKoini {

}

export class Koini extends Creature implements IKoini {
    constructor() {
        super({})
    }
}
