import { Animator, IAnimator } from '../../../engine/display/Animator'
import { Tween } from '../../../engine/display/tween/Tween'
import { IShowHide } from '../../../interface/IShowHide'
import { RespawnScreen } from './RespawnScreen'
const AnimTimes = require('../../../json/AnimTimes.json')

export interface IRespawnScreenAnimator extends IAnimator, IShowHide {

}

export interface RespawnScreenAnimatorOptions {
    screen: RespawnScreen
}

export class RespawnScreenAnimator extends Animator implements IRespawnScreenAnimator {
    screen: RespawnScreen

    constructor(options: RespawnScreenAnimatorOptions) {
        super()

        this.screen = options.screen
    }

    async show() {
        this.currentAnimation = Tween.to(this.alphaTargets, {
            duration: AnimTimes.RespawnScreen.HeaderFade,
            alpha: 1
        })

        this.play()
    }

    async hide() {
        this.currentAnimation = Tween.to(this.alphaTargets, {
            duration: AnimTimes.RespawnScreen.HeaderFade,
            alpha: 0
        })

        this.play()
    }

    get alphaTargets() {
        return [
            this.screen.darkener,
            this.screen.respawnHeader
        ]
    }
}
