import { ClientEntity, IClientEntity } from '../cliententity/ClientEntity'
import { GravityEntity, GravityEntityOptions, IGravityEntity } from '../cliententity/GravityEntity'
import { Sprite } from '../engine/display/Sprite'

export interface ICreature extends IGravityEntity {
    interact(): void
    die(): void
}

export interface CreatureOptions extends GravityEntityOptions {
    type: CreatureType
    idleSprite: Sprite
}

export abstract class Creature extends GravityEntity implements ICreature {
    constructor(options: CreatureOptions) {
        super({
            sprite: options.idleSprite
        })
    }

    update() {
        super.update()
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
