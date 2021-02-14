import { TextSprite } from '../TextSprite'
import { IParticle, Particle, ParticleOptions } from './Particle'

export interface ITextParticle extends IParticle {

}

export interface TextParticleOptions extends ParticleOptions {
    text: string
}

export class TextParticle extends Particle implements ITextParticle {
    // textSprite: TextSprite

    constructor(options: TextParticleOptions) {
        options.sprite = new TextSprite({
            text: options.text
        })
        super(options)
    }

    update() {
        super.update()
    }
}
