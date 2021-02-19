import { AssetUrls } from '../../../asset/Assets'
import { Spritesheets, SpritesheetUrls } from '../../../asset/Spritesheets'
import { GlobalScale } from '../../../utils/Constants'
import { AnimatedSprite } from '../AnimatedSprite'
import { IParticle, ParticlePositioningOptions, ParticleOptions, Particle } from './Particle'

export interface ISmallBlastParticle extends IParticle {

}

export class SmallBlastParticle extends Particle implements ISmallBlastParticle {

    constructor(options?: ParticlePositioningOptions) {
        const sprite = new AnimatedSprite({
            textureUrls: [
                AssetUrls.SMALL_BLAST_0, AssetUrls.SMALL_BLAST_1, AssetUrls.SMALL_BLAST_2, AssetUrls.SMALL_BLAST_3
            ],
            animationSpeed: 0.25
        })

        sprite.anchor.set(0.5)
        sprite.play()
        sprite.onComplete = () => {
            this.demolish()
        }

        const op = (options as ParticleOptions)
        op.sprite = sprite

        super(op)

        this.scale.set(GlobalScale, GlobalScale)
    }
}
