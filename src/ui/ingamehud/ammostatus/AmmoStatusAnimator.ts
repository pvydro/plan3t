import { Tween } from '../../../engine/display/tween/Tween'
import { AmmoStatusComponent } from './AmmoStatusComponent'

export interface IAmmoStatusAnimator {
    show(): Promise<any>
    hide(): Promise<any>
}

export interface AmmoStatusAnimatorOptions {
    ammoStatus: AmmoStatusComponent
}

export class AmmoStatusAnimator implements IAmmoStatusAnimator {
    ammoStatus: AmmoStatusComponent
    hideAnim: TweenLite
    showAnim: TweenLite

    constructor(options: AmmoStatusAnimatorOptions) {
        this.ammoStatus = options.ammoStatus

        this.hideAnim = Tween.to(this.ammoStatus, {
            alpha: 0
        })

        this.showAnim = Tween.to(this.ammoStatus, {
            alpha: 0
        })
    }

    async show() {
        await this.showAnim.play()
    }

    async hide() {
        await this.hideAnim.play()
    }
}
