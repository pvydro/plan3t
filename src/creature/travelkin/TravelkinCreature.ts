import { GroundPatherAI, IGroundPatherAI } from '../../ai/groundpather/GroundPatherAI'
import { GravityOrganismState } from '../../cliententity/gravityorganism/GravityOrganism'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'
import { Sprite } from '../../engine/display/Sprite'
import { trimArray } from '../../utils/Utils'
import { Bullet } from '../../weapon/projectile/Bullet'
import { ICreature, Creature, CreatureOptions } from '../Creature'
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
    walkingSheet?: PIXI.Spritesheet
}

export class TravelkinCreature extends Creature implements ITravelkinCreature {
    _movementState: TravelkinMovementState = TravelkinMovementState.NotSet
    walkingSprite: AnimatedSprite
    animator: ITravelkinAnimator
    walkSpeed: number
    ai: IGroundPatherAI
    movementController: ITravelkinMovementController
    currentShown?: AnimatedSprite | Sprite

    constructor(options: TravelkinCreatureOptions) {
        super(options)

        const travelkin = this

        this.walkSpeed = options.walkSpeed ?? 5
        this.ai = new GroundPatherAI({ gravityOrganism: travelkin })
        this.animator = new TravelkinAnimator({
            travelkin,
            walkingSheet: options.walkingSheet ?? undefined
        })
        this.movementController = new TravelkinMovementController({ travelkin })

        // Add walkingsprite if walkingsheet was passed through
        if (options.walkingSheet) {
            this.walkingSprite = this.animator.walkingSprite
            this.addChild(this.walkingSprite)
        }
    }

    update() {
        this.ai.update()
        this.movementController.update()
        
        super.update()
    }

    showIdleSprite() {
        if (this.currentShown !== this.sprite) {
            this.currentShown = this.sprite
        }

        this.hideAllExcept(this.sprite)
    }

    showWalkingSprite() {
        if (this.walkingSprite) {
            if (this.currentShown !== this.walkingSprite) {
                this.walkingSprite.gotoAndPlay(0)
                this.currentShown = this.walkingSprite
            }
    
            this.hideAllExcept(this.walkingSprite)
            this.walkingSprite.play()
        }
    }

    getAllSprites() {
        return trimArray(this.sprite, this.walkingSprite)
    }

    hideAllExcept(shownSprite: any) {
        const hideable = this.getAllSprites()

        for (var i in hideable) {
            const hideElement = hideable[i]

            if (hideElement !== shownSprite) {
                hideElement.alpha = 0
            }
        }

        shownSprite.alpha = 1
    }

    flipAllSprites() {
        this.sprite.flipX()
        if (this.walkingSprite) this.walkingSprite.flipX()
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
