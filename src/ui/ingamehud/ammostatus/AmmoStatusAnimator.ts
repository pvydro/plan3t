import { Tween } from '../../../engine/display/tween/Tween'
import { IShowHide } from '../../../interface/IShowHide'
import { IAmmoStatusComponent } from './AmmoStatusComponent'

export interface IAmmoStatusAnimator extends IShowHide {
    
}

export interface AmmoStatusAnimatorOptions {
    ammoStatus: IAmmoStatusComponent
}

export class AmmoStatusAnimator implements IAmmoStatusAnimator {
    ammoStatus: IAmmoStatusComponent
    hideAnim: TweenLite
    showAnim: TweenLite

    constructor(options: AmmoStatusAnimatorOptions) {
        this.ammoStatus = options.ammoStatus

        this.showAnim = Tween.to(this.ammoStatus, {
            alpha: 1
        })
        this.hideAnim = Tween.to(this.ammoStatus, {
            alpha: 0
        })
    }

    async show() {
        this.showAnim.restart()
        await this.showAnim.play()
    }

    async hide() {
        this.hideAnim.restart()
        await this.hideAnim.play()
    }
}
