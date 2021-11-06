import { IUpdatable } from '../../interface/IUpdatable'
import { getRandomBool, getRandomFloatBetween } from '../../utils/Math'
import { IUIScreen } from './UIScreen'

export interface IUIScreenShaker {

}

export interface UIScreenShakeOptions {
    shouldShake: true
    shakeAmount?: number
    shakeEase?: number
}

export class UIScreenShaker implements IUIScreenShaker {
    screen: IUIScreen
    shakeInterval: number = 50
    shakeAmount: number
    shakeEase: number
    currentShakeTimeout: number

    constructor(screen: IUIScreen, options: UIScreenShakeOptions) {
        this.screen = screen
        this.shakeAmount = options.shakeAmount ?? 10
        this.shakeEase = options.shakeEase ?? 0.1
    }

    startShake() {
        const shakeRandom = getRandomFloatBetween(0, 20)
        const shakeInterval = this.shakeInterval
            + (getRandomBool() ? shakeRandom : -shakeRandom)

        this.currentShakeTimeout = window.setTimeout(() => {
        }, shakeInterval)
    }

    // update() {

    // }
}
