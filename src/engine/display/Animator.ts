import { TweenLite } from 'gsap/src/all'

export interface PositionAnimateable {
    x: number
    y: number
}

export interface PositionAndAlphaAnimateable extends PositionAnimateable {
    alpha: number
}

export interface IAnimator {
    currentAnimation: TweenLite
    play(): Promise<any>
    playInReverse(from?: number, rules?: PlayRules): Promise<any>
    pause(rules?: PlayRules): Promise<any>
}

export interface PlayRules {
    interruptCurrentAnimation?: boolean
}

export class Animator implements IAnimator {
    _currentAnimation: TweenLite
    
    constructor() {

    }

    async play(rules?: PlayRules) {
        this.interruptIfNeeded(rules)

        return this._currentAnimation.play()
    }

    async playInReverse(from?: number, rules?: PlayRules) {
        this.interruptIfNeeded(rules)

        return this._currentAnimation.reverse(from)
    }

    async pause() {
        this._currentAnimation.pause()
    }

    private interruptIfNeeded(rules?: PlayRules) {
        const interruptCurrentAnimation = rules && rules.interruptCurrentAnimation
            ? rules.interruptCurrentAnimation : false

        if (interruptCurrentAnimation && this._currentAnimation) {
            this._currentAnimation.pause()
        }
    }

    set currentAnimation(value: TweenLite) {
        if (this.currentAnimation) {
            this._currentAnimation.pause()
        }

        this._currentAnimation = value
        this._currentAnimation.restart()
    }

    get currentAnimation() {
        return this._currentAnimation
    }
}
