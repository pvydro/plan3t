import { Animator, IAnimator } from '../../../engine/display/Animator'
import { Tween } from '../../../engine/display/tween/Tween'
import { log } from '../../../service/Flogger'
import { ICrosshair } from './Crosshair'

export interface ICrosshairAnimator extends IAnimator {
    show(shouldShow: boolean): Promise<void>
}

export interface CrosshairAnimatorOptions {
    crosshair: ICrosshair
}

export class CrosshairAnimator extends Animator implements ICrosshairAnimator {
    showAnimation: TweenLite

    constructor(options: CrosshairAnimatorOptions) {
        super()

        this.showAnimation = Tween.to(options.crosshair, {
            alpha: 1,
            duration: 0.5,
        })
    }


    async show(shouldShow: boolean) {
        log('CrosshairAnimator', 'show', 'shouldShow', shouldShow)

        this.currentAnimation = this.showAnimation

        if (shouldShow) {
            this.play()
        } else {
            this.playInReverse()
        }
    }

}
