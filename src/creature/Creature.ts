import { GravityEntity, GravityEntityOptions, IGravityEntity } from '../cliententity/GravityEntity'
import { Sprite } from '../engine/display/Sprite'
import { Direction } from '../engine/math/Direction'

export interface ICreature extends IGravityEntity {
    interact(): void
    die(): void
    flipAllSprites(): void
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
        options.addDebugRectangle = options.addDebugRectangle ?? true
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

    interact() {

    }

    die() {

    }

    flipAllSprites() {
        this.sprite.flipX()
    }

    set direction(value: Direction) {
        if (this._direction !== value) {
            this.flipAllSprites()
        }
        
        this._direction = value
    }

    get direction() {
        return this._direction
    }
}

export enum CreatureType {
    Koini = 'Koini',
    PassiveHornet = 'PassiveHornet'
}
