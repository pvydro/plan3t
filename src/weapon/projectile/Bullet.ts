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
    velocity: number

    constructor(options?: BulletOptions) {
        const assetUrl = Assets.get(AssetUrls.PROJECTILE_BULLET)
        const sprite = new Sprite({ texture: PIXI.Texture.from(assetUrl) })
        super({
            sprite,
        })

        if (options) {
            this.rotation = options.rotation ?? 0
            this.velocity = options.velocity ?? Defaults.BulletVelocity
        }

        this.scale.set(GlobalScale, GlobalScale)
    }
}
