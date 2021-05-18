import { Assets, AssetUrls } from '../../../asset/Assets'
import { Sprite } from '../Sprite'
import { GravityParticle, GravityParticleOptions } from './GravityParticle'
import { IParticle } from './Particle'

export interface IKillSkullParticle extends IParticle {

}

export class KillSkullParticle extends GravityParticle implements IKillSkullParticle {
    constructor(options: GravityParticleOptions) {
        options.weight = -0.5 //-0.5
        options.yVelAcceleration = 0.25
        options.minStartYVel = -2.75
        options.minimumLifespan = 200
        options.sprite = new Sprite({
            texture: PIXI.Texture.from(Assets.get(AssetUrls.KillSkullParticle))
        })

        super(options)
    }
    
    update() {
        super.update()

        if (this.yVel > 0) this.yVel = 0
    }
}
