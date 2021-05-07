import { Key } from 'ts-keycode-enum'
import { GravityOrganism, GravityOrganismOptions, IGravityOrganism } from '../cliententity/gravityorganism/GravityOrganism'
import { Sprite } from '../engine/display/Sprite'
import { Direction } from '../engine/math/Direction'
import { Rect } from '../engine/math/Rect'
import { InputEvents, InputProcessor } from '../input/InputProcessor'

export interface ICreature extends IGravityOrganism {
    interact(): void
    flipAllSprites(): void
}

export interface CreatureOptions extends GravityOrganismOptions {
    type: CreatureType
    idleSprite: Sprite
}

export abstract class Creature extends GravityOrganism implements ICreature {
    static CreatureIdIteration: number = 0
    entityId: string

    constructor(options: CreatureOptions) {
        options.sprite = options.idleSprite
        options.sprite.anchor.x = 0.5
        options.plugins = options.plugins ?? {}
        options.addDebugRectangle = options.addDebugRectangle ?? true
        options.boundingBoxAnchor = options.boundingBoxAnchor ?? { x: 0.5, y: 0 }
        options.boundingDimensions = options.boundingDimensions ?? {
            width: options.idleSprite.width,
            height: options.idleSprite.height
        }
        options.plugins = {
            addFlashPlugin: true,
            addKnockbackPlugin: true
        }
        
        super(options)

        this.entityId = 'Creature' + Creature.CreatureIdIteration++

        InputProcessor.on(InputEvents.KeyDown, (event: KeyboardEvent) => {
            if (event.which === Key.G) {
                this.flash()
            }
        })
    }

    update() {
        super.update()
    }

    interact() {

    }

    hitWall(wallRect: Rect) {
        super.hitWall(wallRect)
    }

    takeDamage(damageAmount: number) {
        this.flash()
        this.knockback()

        super.takeDamage(damageAmount)
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
    // Passive
    Koini = 'Koini',
    PassiveHornet = 'PassiveHornet',

    // Enemies
    FlyingEye = 'FlyingEye',
    Sorm = 'Sorm',
}
