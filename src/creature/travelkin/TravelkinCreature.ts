import { GroundPatherAI, IGroundPatherAI } from '../../ai/groundpather/GroundPatherAI'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'
import { Sprite } from '../../engine/display/Sprite'
import { ICreature, Creature, CreatureOptions } from '../Creature'
import { ITravelkinAnimator, TravelkinAnimator } from './TravelkinAnimator'
import { ITravelkinMovementController, TravelkinMovementController } from './TravelkinMovementController'

export enum TravelkinMovementState {
    NotSet,
    Idle,
    Walking
}

export interface ITravelkinCreature extends ICreature {
    ai: IGroundPatherAI
    movementState: TravelkinMovementState
    walkSpeed: number
    showIdleSprite(): void
    showWalkingSprite(): void
}

export interface TravelkinCreatureOptions extends CreatureOptions {
    walkSpeed?: number
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
        this.ai = new GroundPatherAI({ gravityEntity: travelkin })
        this.animator = new TravelkinAnimator({ travelkin })
        this.movementController = new TravelkinMovementController({ travelkin })
        this.walkingSprite = this.animator.walkingSprite

        this.addChild(this.walkingSprite)
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
        if (this.currentShown !== this.walkingSprite) {
            this.walkingSprite.gotoAndPlay(0)
            this.currentShown = this.walkingSprite
        }

        this.hideAllExcept(this.walkingSprite)
        this.walkingSprite.play()
    }

    hideAllExcept(shownSprite: any) {
        const hideable = [
            this.sprite, this.walkingSprite
        ]

        for (var i in hideable) {
            const hideElement = hideable[i]

            if (hideElement !== shownSprite) {
                hideElement.alpha = 0
            }
        }

        shownSprite.alpha = 1
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

    flipAllSprites() {
        this.walkingSprite.flipX()
    }
}
