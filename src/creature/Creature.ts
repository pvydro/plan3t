import { ClientEntity, IClientEntity } from '../cliententity/ClientEntity'

export interface ICreature extends IClientEntity {
    interact(): void
    die(): void
}

export interface CreatureOptions {

}

export abstract class Creature extends ClientEntity implements ICreature {
    constructor(options: CreatureOptions) {
        super()
    }

    interact(): void {

    }

    die(): void {

    }
}

export enum CreatureType {
    Koini = 'Koini'
}
