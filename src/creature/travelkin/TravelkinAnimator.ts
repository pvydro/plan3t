import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'
import { Animator, IAnimator } from '../../engine/display/Animator'
import { ITravelkinCreature, TravelkinMovementState } from './TravelkinCreature'

export interface ITravelkinAnimator extends IAnimator {
    walkingSprite: AnimatedSprite
    walkingSheet?: PIXI.Spritesheet
    updateAnimationState(): void
}

export interface TravelkinAnimatorOptions {
    travelkin: ITravelkinCreature
    walkingSheet?: PIXI.Spritesheet
}

export class TravelkinAnimator extends Animator implements ITravelkinAnimator {
    travelkin: ITravelkinCreature
    walkingSprite: AnimatedSprite

    constructor(options: TravelkinAnimatorOptions) {
        super()

        this.travelkin = options.travelkin

        if (options.walkingSheet && options.walkingSheet.animations) {
            this.walkingSprite = new AnimatedSprite({
                sheet: options.walkingSheet.animations['tile'],
                animationSpeed: 0.25,
                loop: true
            })
            this.walkingSprite.anchor.set(0.5, 0)
        }
    }

    updateAnimationState() {
        switch (this.travelkin.movementState) {
            case TravelkinMovementState.Idle:
                this.travelkin.showIdleSprite()
                break
            case TravelkinMovementState.Walking:
                if (this.walkingSprite) {
                    this.travelkin.showWalkingSprite()
                }
                break
        }
    }
}
