import { Animator, IAnimator } from '../../../engine/display/Animator'
import { Tween } from '../../../engine/display/tween/Tween'
import { log } from '../../../service/Flogger'
import { ILoadingScreen } from './LoadingScreen'

export interface ILoadingScreenAnimator extends IAnimator {
    show(shouldShow: boolean): Promise<any>
}

export interface LoadingScreenAnimatorOptions {
    screen: ILoadingScreen
}

export class LoadingScreenAnimator extends Animator implements ILoadingScreenAnimator {
    showAnimation: TweenLite
    hideAnimation: TweenLite

    constructor(options: LoadingScreenAnimatorOptions) {
        super()

        const screen = options.screen

        this.showAnimation = Tween.to(screen, {
            alpha: 1,
            duration: 0.5
        })
        this.hideAnimation = Tween.to(screen, {
            alpha: 0,
            duration: 0.5
        })
    }

    show(shouldShow: boolean) {
        log('LoadingScreenAnimator', 'show', 'shouldShow', shouldShow)

        this.currentAnimation = shouldShow ? this.showAnimation : this.hideAnimation
        
        return this.play()
    }
}
