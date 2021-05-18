import { Animator, IAnimator } from '../../../engine/display/Animator'
import { Tween } from '../../../engine/display/tween/Tween'
import { IWaveRunnerScreen } from './WaveRunnerScreen'
const AnimTimes = require('../../../json/AnimTimes.json')

export interface IWaveRunnerScreenAnimator extends IAnimator {
    screen: IWaveRunnerScreen
}

export interface WaveRunnerScreenAnimatorOptions {
    screen: IWaveRunnerScreen
}

export class WaveRunnerScreenAnimator extends Animator {
    screen: IWaveRunnerScreen

    constructor(options: WaveRunnerScreenAnimatorOptions) {
        super()

        this.screen = options.screen
    }

    async show() {
        this.currentAnimation = Tween.to(this.alphaTargets, {
            duration: AnimTimes.Defaults.HeaderFade,
            alpha: 1
        })

        this.play()
    }

    async hide() {
        this.currentAnimation = Tween.to(this.alphaTargets, {
            duration: AnimTimes.Defaults.HeaderFade,
            alpha: 0
        })

        this.play()
    }

    forceHide() {
        for (var i in this.alphaTargets) {
            const alphaTarget = this.alphaTargets[i]

            alphaTarget.alpha = 0
        }
    }

    get alphaTargets() {
        return [
            // this.screen.darkener,
            this.screen
        ]
    }
}
