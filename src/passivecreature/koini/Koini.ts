import { PassiveCreature, PassiveCreatureOptions } from '../PassiveCreature'

export interface IKoini {

}

export interface KoiniOptions extends PassiveCreatureOptions {

}

export class Koini extends PassiveCreature implements IKoini {
    constructor(options: KoiniOptions) {
        super(options)
    }
}
