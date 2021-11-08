import { GravityOrganism, GravityOrganismOptions, GravityOrganismState, IGravityOrganism } from '../cliententity/gravityorganism/GravityOrganism'
import { AnimatedSprite } from '../engine/display/AnimatedSprite'
import { Sprite } from '../engine/display/Sprite'
import { Direction } from '../engine/math/Direction'
import { Rect } from '../engine/math/Rect'
import { log } from '../service/Flogger'
import { asyncTimeout } from '../utils/Utils'
import { Bullet } from '../weapon/projectile/Bullet'
import { CreatureAttacker, CreatureAttackerOptions, CreatureAttackOptions, ICreatureAttacker } from './CreatureAttacker'
import { CreatureSprites, CreatureSpriteStore } from './CreatureSpriteStore'
import { CreatureType } from './CreatureType'

export interface ICreature extends IGravityOrganism {
    idleSprite: Sprite | AnimatedSprite
    walkingSpriteAnimated: AnimatedSprite
    isPassive: boolean
    attackRadius: number
    attacker: ICreatureAttacker
    interact(): void
    attack(): Promise<void>
    flipAllSprites(): void
    showIdleSprite(): void
    showWalkingSprite(): void
    showDyingSprite(): void
}

export interface CreatureOptions extends GravityOrganismOptions {
    type: CreatureType
    sprites: CreatureSprites
    passive?: boolean
    attackOptions?: CreatureAttackOptions
}

export abstract class Creature extends GravityOrganism implements ICreature {
    static CreatureIdIteration: number
    entityId: string
    spriteStore: CreatureSpriteStore
    passive: boolean
    attacker: ICreatureAttacker
    // attackRadius: number

    constructor(options: CreatureOptions) {
        const idleSprite = (options.sprites.idleSpriteDef && options.sprites.idleSpriteDef.sprite)

        options.addDebugRectangle = options.addDebugRectangle ?? true
        options.boundingBoxAnchor = options.boundingBoxAnchor ?? { x: 0.5, y: 0 }
        options.plugins = options.plugins ?? { addFlashPlugin: true, addKnockbackPlugin: true }

        if (idleSprite as Sprite) {
            options.boundingDimensions = options.boundingDimensions ?? {
                width: (idleSprite as Sprite).width,
                height: (idleSprite as Sprite).height
            }
        }

        super(options)

        const attackerOptions: CreatureAttackerOptions = { ...options.attackOptions, creature: this }

        this.targetServerLerpRate = 0.35
        this.entityId = 'Creature' + Creature.CreatureIdIteration++
        this.spriteStore = new CreatureSpriteStore(options.sprites)
        this.attacker = new CreatureAttacker(attackerOptions)

        this.addChild(this.spriteStore)

        // TODO: FIXME TMP
        // InputProcessor.on(InputEvents.KeyDown, (event: KeyboardEvent) => {
        //     if (event.which === Key.G) {
        //         this.flash()
        //     }
        // })
    }

    update() {
        this.attacker.update()
        super.update()
    }

    interact() {

    }

    async attack() {
        log('Creature', this.name, 'attack')

        await this.attacker.attack()
    }

    hitWall(wallRect: Rect) {
        super.hitWall(wallRect)
    }

    takeDamage(damage: number | Bullet) {
        this.flash()
        
        if (damage instanceof Bullet) {
            const bullet = damage as Bullet
            const direction = (bullet.xVel > 0) ? Direction.Right : Direction.Left

            this.knockback({ direction })
        }

        if (this.isDead) return

        super.takeDamage(damage)
    }

    async die() {
        if (this.isDead) return

        this._isDead = true

        this.organismState = GravityOrganismState.Dead
        this.showDyingSprite()
        this.jump((this.jumpHeight / 2), true)
        
        await asyncTimeout(2000)
        await super.die()
    }

    showIdleSprite() {
        if (this.isDead) return

        this.spriteStore.showSprite(this.idleSprite)
    }

    showWalkingSprite() {
        if (this.isDead) return

        this.spriteStore.showSprite(this.walkingSprite)
    }

    showDyingSprite() {
        this.spriteStore.showSprite(this.dyingSprite)
    }

    showAttackingSprite() {
        this.spriteStore.showSprite(this.attackingSprite)
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
        if (this.isDead) return

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

    get attackingSprite() {
        return this.spriteStore.attackingSprite
    }
    
    get walkingSpriteAnimated() {
        return this.spriteStore.walkingSpriteAnimated
    }

    get dyingSpriteAnimated() {
        return this.spriteStore.dyingSpriteAnimated
    }

    get attackingSpriteAnimated() {
        return this.spriteStore.attackingSprite
    }

    get isPassive() {
        return this.passive
    }

    get attackRadius() {
        return this.attacker.attackRadius        
    }
}
