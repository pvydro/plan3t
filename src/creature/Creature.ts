import { Key } from 'ts-keycode-enum'
import { GravityOrganism, GravityOrganismOptions, GravityOrganismState, IGravityOrganism } from '../cliententity/gravityorganism/GravityOrganism'
import { AnimatedSprite } from '../engine/display/AnimatedSprite'
import { Sprite } from '../engine/display/Sprite'
import { Spritesheet } from '../engine/display/spritesheet/Spritesheet'
import { Direction } from '../engine/math/Direction'
import { Rect } from '../engine/math/Rect'
import { InputEvents, InputProcessor } from '../input/InputProcessor'
import { asyncTimeout } from '../utils/Utils'
import { Bullet } from '../weapon/projectile/Bullet'
import { CreatureSprites, CreatureSpriteStore } from './CreatureSpriteStore'
import { CreatureType } from './CreatureType'

export interface ICreature extends IGravityOrganism {
    idleSprite: Sprite | AnimatedSprite
    walkingSpriteAnimated: AnimatedSprite
    interact(): void
    flipAllSprites(): void
}

export interface CreatureOptions extends GravityOrganismOptions {
    type: CreatureType
    sprites: CreatureSprites
}

export abstract class Creature extends GravityOrganism implements ICreature {
    static CreatureIdIteration: number = 0
    entityId: string
    spriteStore: CreatureSpriteStore    

    constructor(options: CreatureOptions) {
        const idleSprite = (options.sprites && options.sprites.idleSpriteDef
            && options.sprites.idleSpriteDef.sprite)

        options.plugins = options.plugins ?? {}
        options.addDebugRectangle = options.addDebugRectangle ?? true
        options.boundingBoxAnchor = options.boundingBoxAnchor ?? { x: 0.5, y: 0 }
        if (idleSprite as Sprite) {
            options.boundingDimensions = options.boundingDimensions ?? {
                width: (idleSprite as Sprite).width,
                height: (idleSprite as Sprite).height
            }
        }
        options.plugins = {
            addFlashPlugin: true,
            addKnockbackPlugin: true
        }
        
        super(options)

        this.entityId = 'Creature' + Creature.CreatureIdIteration++
        this.spriteStore = new CreatureSpriteStore(options.sprites)

        this.addChild(this.spriteStore)

        // TODO: FIXME TMP
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

    takeDamage(damage: number | Bullet) {
        this.flash()

        if (damage instanceof Bullet) {
            const bullet = damage as Bullet
            let direction = (bullet.xVel > 0) ? Direction.Right : Direction.Left

            this.knockback({ direction })
        }

        super.takeDamage(damage)
    }

    async die() {
        if (this.isDead) return

        this.organismState = GravityOrganismState.Dead

        this.jump(this.jumpHeight / 2)
        
        await asyncTimeout(2000)
        await super.die()
    }

    showIdleSprite() {
        this.spriteStore.showSprite(this.idleSprite)
    }

    showWalkingSprite() {
        this.spriteStore.showSprite(this.walkingSprite)
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

    set organismState(value: GravityOrganismState) {
        if (value === GravityOrganismState.Dead && !this.isDead) {
            this.spriteStore.showSprite(this.spriteStore.dyingSprite)
        }

        this._organismState = value
    }

    get idleSprite() {
        return this.spriteStore.idleSprite
    }

    get walkingSprite() {
        return this.spriteStore.walkingSprite
    }

    get dyingSprite() {
        return this.spriteStore.dyingSprite
    }
    
    get walkingSpriteAnimated() {
        return this.spriteStore.walkingSpriteAnimated
    }

    get dyingSpriteAnimated() {
        return this.spriteStore.dyingSpriteAnimated
    }
}
