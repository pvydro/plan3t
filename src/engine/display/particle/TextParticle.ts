import { TweenLite } from 'gsap/all'
import { TextSprite } from '../TextSprite'
import { PredefinedTweens } from '../tween/PredefinedTweens'
import { Tween, TweenOptions } from '../tween/Tween'
import { Easing } from '../tween/TweenEasing'
import { IParticle, Particle, ParticleOptions } from './Particle'

export interface ITextParticle extends IParticle {

}

export interface TextParticlePositionRandomizationOptions {
    shouldRandomize?: boolean
    randomizationRange?: number
}

export interface TextParticleOptions extends ParticleOptions, TweenOptions {
    text: string
    fadeUpAmount?: number
    fadeOutBreakpoint?: number
    fadeOutDivisor?: number
    startAlpha?: number
    positionRandomization?: TextParticlePositionRandomizationOptions
}

export class TextParticle extends Particle implements ITextParticle {
    exitAnimation: TweenLite
    fadeUpAmount: number
    fadeOutDivisor: number
    startFadeOut: boolean
    animationComplete: boolean

    constructor(options: TextParticleOptions) {
        options.sprite = new TextSprite({
            text: options.text,
            fontSize: 16
        })
        super(options)

        const swipeUpAnim = PredefinedTweens.SwipeUp
        
        this.fadeUpAmount = options.fadeUpAmount ?? -swipeUpAnim.offsetY
        this.fadeOutDivisor = options.fadeOutDivisor ?? 10
        this.alpha = options.startAlpha ?? 1

        this.startExitAnimation(options)

        if (options.positionRandomization !== undefined
        && options.positionRandomization.shouldRandomize !== false) {
            const randomizationRange = options.positionRandomization.randomizationRange ?? 32
            let randomX = Math.random() * randomizationRange
            let randomY = Math.random() * randomizationRange

            randomX *= (Math.random() > 0.5 ? 1 : -1)
            randomY *= (Math.random() > 0.5 ? 1 : -1)

            this.x += randomX
            this.y += randomY
        }
    }

    startExitAnimation(options: TextParticleOptions) {
        const self = this
        const int = { interpolation: 0 }
        const fadeOutBreakpoint = options.fadeOutBreakpoint ?? 0.75
        const swipeUpAnim = PredefinedTweens.SwipeUp

        this.exitAnimation = Tween.to(int, {
            interpolation: 1,
            duration: options.duration ?? swipeUpAnim.duration,
            ease: options.ease ?? swipeUpAnim.ease,
            onUpdate() {
                self.sprite.y = self.fadeUpAmount * int.interpolation

                if (int.interpolation > fadeOutBreakpoint) {
                    self.startFadeOut = true
                }

                // Optional onUpdate
                if (typeof options.onUpdate === 'function') {
                    options.onUpdate()
                }
            },
            onComplete() {
                self.animationComplete = true

                // Optional onComplete
                if (typeof options.onComplete === 'function') {
                    options.onComplete()
                }
            }
        })

        this.exitAnimation.play()
    }

    update() {
        super.update()

        if (this.startFadeOut) {
            this.alpha += (0 - this.alpha) / this.fadeOutDivisor

            if (this.animationComplete) {
                if (this.alpha <= 0.001) {
                    this.demolish()
                }
            }
        }
    }
}
