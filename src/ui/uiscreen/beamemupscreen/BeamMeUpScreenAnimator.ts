import { TweenLite } from 'gsap/src/all'
import { Animator, IAnimator } from '../../../engine/display/Animator'
import { Tween } from '../../../engine/display/tween/Tween'
import { IShowHide } from '../../../interface/IShowHide'
import { IBeamMeUpScreen } from './BeamMeUpScreen'
const AnimTimes = require('../../../json/AnimTimes.json')

export interface IBeamMeUpScreenAnimator extends IAnimator, IShowHide {

}

export interface BeamMeUpScreenAnimatorOptions {
    screen: IBeamMeUpScreen
}

export class BeamMeUpScreenAnimator extends Animator implements IBeamMeUpScreenAnimator {
    showAnimation: TweenLite
    hideAnimation: TweenLite
    screen: IBeamMeUpScreen

    constructor(options: BeamMeUpScreenAnimatorOptions) {
        super()

        this.screen = options.screen

        this.showAnimation = Tween.to(this.alphaTargets, {
            duration: AnimTimes.Defaults.HeaderFade,
            alpha: 1
        })
        this.hideAnimation = Tween.to(this.alphaTargets, {
            duration: AnimTimes.Defaults.HeaderFade,
            alpha: 0
        })
    }

    async show() {
        this.currentAnimation = this.showAnimation
        this.play()
    }

    async hide() {
        this.currentAnimation = this.hideAnimation
        this.play()
    }

    get alphaTargets() {
        return [
            this.screen.header
        ]
    }
}
