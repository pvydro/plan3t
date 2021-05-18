import { Assets, AssetUrls } from '../../../asset/Assets'
import { Sprite } from '../Sprite'
import { GravityParticle, GravityParticleOptions } from './GravityParticle'
import { IParticle } from './Particle'

export interface IKillSkullParticle extends IParticle {

}

export class KillSkullParticle extends GravityParticle implements IKillSkullParticle {
    constructor(options: GravityParticleOptions) {
        options.sprite = new Sprite({
            texture: PIXI.Texture.from(Assets.get(AssetUrls.KillSkullParticle))
        })
        options.weight = -1

        super(options)

        this.minimumLifespan = 200
    }
}
