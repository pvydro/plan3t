import { ClientEntity } from '../cliententity/ClientEntity'

export interface IPassiveCreature {
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
