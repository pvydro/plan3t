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
    static CreatureIdIteration: number = 0
    entityId: string

    constructor(options: CreatureOptions) {
        options.sprite = options.idleSprite
        options.addDebugRectangle = true
        options.boundingBox = {
            x: 0, y: 0, 
            width: options.idleSprite.width,
            height: options.idleSprite.height
        }

        super(options)

        this.entityId = 'Creature' + Creature.CreatureIdIteration++
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
