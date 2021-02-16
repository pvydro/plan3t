import gsap, { TweenLite } from 'gsap/all'
import { TextSprite } from '../TextSprite'
import { Tween } from '../tween/Tween'
import { IParticle, Particle, ParticleOptions } from './Particle'

export interface ITextParticle extends IParticle {

}

export interface TextParticleOptions extends ParticleOptions {
    text: string
    fadeUpAmount?: number
}

export class TextParticle extends Particle implements ITextParticle {
    exitAnimation: TweenLite
    fadeUpAmount: number

    constructor(options: TextParticleOptions) {
        options.sprite = new TextSprite({
            text: options.text
        })
        super(options)
        
        this.fadeUpAmount = options.fadeUpAmount ?? 16

        const self = this
        const int = { interpolation: 0 }

        this.exitAnimation = Tween.to(int, {
            duration: 0.5,
            interpolation: 1,
            onUpdate() {
                self.sprite.y = self.fadeUpAmount * int.interpolation
            }
        })

        this.exitAnimation.play()
    }

    update() {
        super.update()
    }
}
