import { GroundPatherAI, IGroundPatherAI } from '../../ai/groundpather/GroundPatherAI'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Spritesheet } from '../../engine/display/spritesheet/Spritesheet'
import { trimArray } from '../../utils/Utils'
import { Bullet } from '../../weapon/projectile/Bullet'
import { ICreature, Creature, CreatureOptions } from '../Creature'
import { CreatureSpriteStore } from '../CreatureSpriteStore'
import { ITravelkinAnimator, TravelkinAnimator } from './TravelkinAnimator'
import { ITravelkinMovementController, TravelkinMovementController } from './TravelkinMovementController'

export enum TravelkinMovementState {
    NotSet,
    Idle,
    Walking,
    Dead
}

export interface ITravelkinCreature extends ICreature {
    ai: IGroundPatherAI
    movementState: TravelkinMovementState
    walkSpeed: number
    isDead: boolean
    showIdleSprite(): void
    showWalkingSprite(): void
}

export interface TravelkinCreatureOptions extends CreatureOptions {
    walkSpeed?: number
    walkingSheet?: Spritesheet
}

export class TravelkinCreature extends Creature implements ITravelkinCreature {
    _movementState: TravelkinMovementState = TravelkinMovementState.NotSet
    animator: ITravelkinAnimator
    walkSpeed: number
    ai: IGroundPatherAI
    movementController: ITravelkinMovementController
    currentShown?: AnimatedSprite | Sprite | Container

    constructor(options: TravelkinCreatureOptions) {
        super(options)

        const travelkin = this

        this.spriteStore = new CreatureSpriteStore(options.sprites)
        this.walkSpeed = options.walkSpeed ?? 5
        this.ai = new GroundPatherAI({ gravityOrganism: travelkin })
        this.animator = new TravelkinAnimator({
            travelkin, // TODO This one below 
            walkingSprite: this.spriteStore.walkingSprite ?? undefined
        })
        this.movementController = new TravelkinMovementController({ travelkin })

        this.addChild(this.spriteStore)
    }

    update() {
        this.ai.update()
        this.movementController.update()
        
        super.update()
    }

    getAllSprites() {
        return trimArray(this.idleSprite, this.walkingSprite, this.dyingSprite)
    }

    flipAllSprites() {
        this.spriteStore.flipAllSprites()
    }

    takeDamage(damage: number | Bullet) {
        this.ai.decideIfContinueOrStop()

        super.takeDamage(damage)
    }

    async die() {
        if (this.movementState === TravelkinMovementState.Dead) return

        this.movementState = TravelkinMovementState.Dead
        this.ai.stop()

        await super.die()
    }

    get movementState() {
        return this._movementState
    }

    set movementState(value: TravelkinMovementState) {
        if (this._movementState !== value) {
            this._movementState = value
            this.animator.updateAnimationState()
        }
    }
}
