import { ClientEntity } from '../cliententity/ClientEntity'
import { IUpdatable } from '../interface/IUpdatable'

export interface IPassiveCreature extends IUpdatable {
    interact(): void
    die(): void
}

export abstract class PassiveCreature extends ClientEntity implements IPassiveCreature {
    constructor() {
        super()
    }

    interact(): void {

    }

    die(): void {

    }
}
