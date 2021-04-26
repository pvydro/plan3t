import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'
import { Animator, IAnimator } from '../../engine/display/Animator'
import { log } from '../../service/Flogger'
import { ITravelkinCreature, TravelkinMovementState } from './TravelkinCreature'

export interface ITravelkinAnimator extends IAnimator {
    walkingSprite: AnimatedSprite
    updateAnimationState(): void
}

export interface TravelkinAnimatorOptions {
    travelkin: ITravelkinCreature
}

export class TravelkinAnimator extends Animator implements ITravelkinAnimator {
    travelkin: ITravelkinCreature
    walkingSprite: AnimatedSprite

    constructor(options: TravelkinAnimatorOptions) {
        super()

        const walkingSheet = Spritesheets.get(SpritesheetUrls.SormWalking)

        this.travelkin = options.travelkin
        this.walkingSprite = new AnimatedSprite({
            sheet: walkingSheet.animations['tile'],
            animationSpeed: 0.25,
            loop: true
        })
        this.walkingSprite.anchor.set(0.5, 0)
    }

    updateAnimationState() {
        switch (this.travelkin.movementState) {
            case TravelkinMovementState.Idle:
                this.travelkin.showIdleSprite()
                break
            case TravelkinMovementState.Walking:
                this.travelkin.showWalkingSprite()
                break
        }
    }
}
