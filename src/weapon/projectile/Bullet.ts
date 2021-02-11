import { Assets, AssetUrls } from '../../asset/Assets'
import { ClientEntity, IClientEntity } from '../../cliententity/ClientEntity'
import { Sprite } from '../../engine/display/Sprite'
import { Defaults, GlobalScale } from '../../utils/Constants'

export enum ProjectileType {
    Bullet = 'Bullet'
}

export interface IBullet extends IClientEntity {

}

export interface BulletOptions {
    rotation?: number
    velocity?: number
}

export class Bullet extends ClientEntity {
    id: number
    private static BulletIdIteration = 0
    velocity: number

    constructor(options?: BulletOptions) {
        const assetUrl = Assets.get(AssetUrls.PROJECTILE_BULLET)
        const sprite = new Sprite({ texture: PIXI.Texture.from(assetUrl) })
        super({
            sprite,
        })
        
        this.id = Bullet.BulletIdIteration++
        this.rotation = options.rotation ?? 0
        this.velocity = options.velocity ?? Defaults.BulletVelocity
        console.log('id', this.id)

        this.xVel = this.velocity * Math.cos(this.rotation)
        this.yVel = this.velocity * Math.sin(this.rotation)

        this.scale.set(GlobalScale, GlobalScale)
    }
}
