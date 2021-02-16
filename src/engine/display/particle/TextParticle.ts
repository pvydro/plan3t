import gsap, { interpolate, TweenLite } from 'gsap/all'
import { TextSprite } from '../TextSprite'
import { Tween, TweenOptions } from '../tween/Tween'
import { Easing } from '../tween/TweenEasing'
import { IParticle, Particle, ParticleOptions } from './Particle'

export interface ITextParticle extends IParticle {

}

export interface TextParticleOptions extends ParticleOptions, TweenOptions {
    text: string
    fadeUpAmount?: number
    fadeOutBreakpoint?: number
    fadeOutDivisor?: number
    startAlpha?: number
}

export class TextParticle extends Particle implements ITextParticle {
    exitAnimation: TweenLite
    fadeUpAmount: number
    fadeOutDivisor: number
    startFadeOut: boolean
    animationComplete: boolean

    constructor(options: TextParticleOptions) {
        options.sprite = new TextSprite({
            text: options.text
        })
        super(options)
        
        this.fadeUpAmount = options.fadeUpAmount ?? -8
        this.fadeOutDivisor = options.fadeOutDivisor ?? 10
        this.alpha = options.startAlpha ?? 1

        const self = this
        const int = { interpolation: 0 }
        const fadeOutBreakpoint = options.fadeOutBreakpoint ?? 0.75

        this.exitAnimation = Tween.to(int, {
            interpolation: 1,
            duration: options.duration ?? 1,
            ease: options.ease ?? Easing.EaseOutExpo,
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
