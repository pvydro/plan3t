import { TweenLite } from 'gsap/all'
import { Tween } from '../../engine/display/tween/Tween'
import { Easing } from '../../engine/display/tween/TweenEasing'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { log } from '../../service/Flogger'
import { getRandomBool, getRandomFloatBetween } from '../../utils/Math'
import { IUIScreen } from './UIScreen'

export interface IUIScreenShaker {

}

export interface UIScreenShakeOptions {
    shouldShake: true
    shakeAmount?: number
}

export class UIScreenShaker implements IUIScreenShaker {
    screen: IUIScreen
    shakeInterval: number = 75
    shakeAmount: number
    currentShakeTimeout: number
    shakeInterpolation: IVector2 = Vector2.Zero
    currentShakeAnimation?: TweenLite

    constructor(screen: IUIScreen, options: UIScreenShakeOptions) {
        this.screen = screen
        this.shakeAmount = options.shakeAmount ?? 3

        this.startShake()
    }

    startShake() {
        const shakeRandom = getRandomFloatBetween(0, 250)
        const shakeInterval = this.shakeInterval
            + (getRandomBool() ? shakeRandom : -shakeRandom)

        this.currentShakeTimeout = window.setTimeout(() => {
            this.applyShakeAnimation()
            this.startShake()
        }, shakeInterval)
    }

    stopShake() {
        log('UIScreenShaker', 'stopShake')

        window.clearTimeout(this.currentShakeTimeout)
    }

    applyShakeAnimation() {
        const shakeAmountRandom = getRandomFloatBetween(0, 3)
        const shakeAmountX = this.shakeAmount
            + (getRandomBool() ? shakeAmountRandom : -shakeAmountRandom)
        const shakeAmountY = this.shakeAmount
            + (getRandomBool() ? shakeAmountRandom : -shakeAmountRandom)
        
        if (this.currentShakeAnimation) this.currentShakeAnimation.kill()

        this.currentShakeAnimation = Tween.to(this.shakeInterpolation, {
            x: (getRandomBool() ? shakeAmountX : -shakeAmountX),
            y: (getRandomBool() ? shakeAmountY : -shakeAmountY),
            duration: 1.25,
            ease: Easing.EaseOutBounce,
            onUpdate: () => {
                if (this.screen.sharedBackground) {
                    this.screen.sharedBackground.x = this.shakeInterpolation.x
                    this.screen.sharedBackground.y = this.shakeInterpolation.y
                }
                this.screen.x = this.shakeInterpolation.x / 3
                this.screen.y = this.shakeInterpolation.y / 3

            }
        }).play()
    }
}
