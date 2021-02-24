import { ClientEntity, IClientEntity } from '../cliententity/ClientEntity'
import { Sprite } from '../engine/display/Sprite'

export interface ICreature extends IClientEntity {
    interact(): void
    die(): void
}

export interface CreatureOptions {
    type: CreatureType
    idleSprite: Sprite
}

export abstract class Creature extends ClientEntity implements ICreature {
    constructor(options: CreatureOptions) {
        super({
            sprite: options.idleSprite
        })
    }

    interact(): void {

    }

    die(): void {

    }
}

export enum CreatureType {
    Koini = 'Koini',
    PassiveHornet = 'PassiveHornet'
}
