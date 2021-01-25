import { IPassiveCreature, PassiveCreature } from '../PassiveCreature'

export interface IPassiveHornet extends IPassiveCreature {

}

export class PassiveHornet extends PassiveCreature implements IPassiveHornet {
    constructor() {
        super()
    }

    interact() {

    }

    die() {

    }
}
