import { ClientEntity, IClientEntity } from '../cliententity/ClientEntity'

export interface IPassiveCreature extends IClientEntity {
    interact(): void
    die(): void
}

export interface PassiveCreatureOptions {

}

export abstract class PassiveCreature extends ClientEntity implements IPassiveCreature {
    constructor(options: PassiveCreatureOptions) {
        super()
    }

    interact(): void {

    }

    die(): void {

    }
}
