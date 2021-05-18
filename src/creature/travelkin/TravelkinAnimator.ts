import { Sprite } from 'pixi.js'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'
import { Animator, IAnimator } from '../../engine/display/Animator'
import { Spritesheet } from '../../engine/display/spritesheet/Spritesheet'
import { ITravelkinCreature, TravelkinMovementState } from './TravelkinCreature'

export interface ITravelkinAnimator extends IAnimator {
    walkingSprite: AnimatedSprite | Sprite
    walkingSheet?: PIXI.Spritesheet
    updateAnimationState(): void
}

export interface TravelkinAnimatorOptions {
    travelkin: ITravelkinCreature
    walkingSprite?: AnimatedSprite | Sprite
}

export class TravelkinAnimator extends Animator implements ITravelkinAnimator {
    travelkin: ITravelkinCreature
    walkingSprite: AnimatedSprite | Sprite

    constructor(options: TravelkinAnimatorOptions) {
        super()

        this.travelkin = options.travelkin

        if (options.walkingSprite && options.walkingSprite) {
            this.walkingSprite = options.walkingSprite
            // new AnimatedSprite({
            //     sheet: options.walkingSheet,
            //     animationSpeed: 0.25,
            //     loop: true
            // })
            // this.walkingSprite.anchor.set(0.5, 0)
        }
    }

    updateAnimationState() {
        switch (this.travelkin.movementState) {
            case TravelkinMovementState.Dead:
                this.travelkin.showDyingSprite()
                break
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
