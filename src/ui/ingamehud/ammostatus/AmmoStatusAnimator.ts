import { Animator, IAnimator } from '../../../engine/display/Animator'
import { Tween } from '../../../engine/display/tween/Tween'
import { IShowHide } from '../../../interface/IShowHide'
import { IAmmoStatusComponent } from './AmmoStatusComponent'

export interface IAmmoStatusAnimator extends IAnimator, IShowHide {
    
}

export interface AmmoStatusAnimatorOptions {
    ammoStatus: IAmmoStatusComponent
}

export class AmmoStatusAnimator extends Animator implements IAmmoStatusAnimator {
    ammoStatus: IAmmoStatusComponent
    hideAnim: TweenLite
    showAnim: TweenLite

    constructor(options: AmmoStatusAnimatorOptions) {
        super()

        this.showAnim = Tween.to(options.ammoStatus, {
            alpha: 1,
            duration: 0.5
        })
        this.hideAnim = Tween.to(options.ammoStatus, {
            alpha: 0,
            duration: 0.5
        })
    }

    async show() {
        this.currentAnimation = this.showAnim
        await this.play()
    }

    async hide() {
        this.currentAnimation = this.hideAnim
        await this.play()
    }
}
