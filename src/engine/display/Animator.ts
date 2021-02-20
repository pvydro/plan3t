export interface IAnimator {
    play(): Promise<any>
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
        const interruptCurrentAnimation = rules && rules.interruptCurrentAnimation
            ? rules.interruptCurrentAnimation : false

        if (interruptCurrentAnimation && this._currentAnimation) {
            this._currentAnimation.pause()
        }

        this._currentAnimation.play()
    }

    async pause() {
        this._currentAnimation.pause()
    }

    set currentAnimation(value: TweenLite) {
        if (this.currentAnimation) {
            this._currentAnimation.pause()
        }

        this._currentAnimation = value
    }

    get currentAnimation() {
        return this._currentAnimation
    }
}
