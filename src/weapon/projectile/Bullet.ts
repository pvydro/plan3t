import { Assets, AssetUrls } from '../../asset/Assets'
import { CameraLayer } from '../../camera/CameraStage'
import { ClientEntity, EntityType, IClientEntity } from '../../cliententity/ClientEntity'
import { GravityEntity } from '../../cliententity/GravityEntity'
import { Sprite } from '../../engine/display/Sprite'
import { IEntityManager } from '../../manager/entitymanager/EntityManager'
import { Defaults, GlobalScale } from '../../utils/Constants'

export enum ProjectileType {
    Bullet = 'Bullet'
}

export interface IBullet extends IClientEntity {

}

export interface BulletOptions {
    rotation?: number
    velocity?: number
    entityManager?: IEntityManager
}

export class Bullet extends GravityEntity implements IBullet {
    private static BulletIdIteration = 0
    _id: number
    entityManager?: IEntityManager
    velocity: number

    constructor(options?: BulletOptions) {
        const assetUrl = Assets.get(AssetUrls.PROJECTILE_BULLET)
        const sprite = new Sprite({ texture: PIXI.Texture.from(assetUrl) })
        super({
            sprite,
            addDebugRectangle: true,
            boundingBoxAnchor: { x: 0.5, y: 0.5 }
        })
        
        this._id = Bullet.BulletIdIteration++
        this.rotation = options.rotation ?? 0
        this.velocity = options.velocity ?? Defaults.BulletVelocity
        this.entityManager = options.entityManager

        this.xVel = this.velocity * Math.cos(this.rotation)
        this.yVel = this.velocity * Math.sin(this.rotation)

        this.type = EntityType.Bullet

        this.scale.set(GlobalScale, GlobalScale)
    }

    get id() {
        return this._id
    }

    // landedOnGround() {
    //     if (this.entityManager !== undefined) {
    //         this.entityManager.removeEntity(this.id.toString(), CameraLayer.Bullet)
    //     }
    // }
}
