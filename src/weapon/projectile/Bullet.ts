import { Assets, AssetUrls } from '../../asset/Assets'
import { CameraLayer } from '../../camera/CameraStage'
import { EntityType } from '../../cliententity/ClientEntity'
import { GravityEntity, IGravityEntity } from '../../cliententity/GravityEntity'
import { Sprite } from '../../engine/display/Sprite'
import { IEntityManager } from '../../manager/entitymanager/EntityManager'
import { ParticleManager } from '../../manager/particlemanager/ParticleManager'
import { Flogger } from '../../service/Flogger'
import { GlobalScale } from '../../utils/Constants'
import { PhysDefaults } from '../../utils/Defaults'

export enum ProjectileType {
    Bullet = 'Bullet'
}

export interface IBullet extends IGravityEntity {
    demolish(): void
    emitGroundHitParticles(): void
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
        const assetUrl = Assets.get(AssetUrls.ProjectileBullet)
        const sprite = new Sprite({ texture: PIXI.Texture.from(assetUrl) })
        sprite.anchor.set(0.5, 0.5)
        super({
            sprite,
            addDebugRectangle: true,
            boundingBoxAnchor: { x: 0.5, y: 0.5 }
        })
        
        this._id = Bullet.BulletIdIteration++
        this.rotation = options.rotation ?? 0
        this.velocity = options.velocity ?? PhysDefaults.bulletVelocity
        this.entityManager = options.entityManager

        this.xVel = this.velocity * Math.cos(this.rotation)
        this.yVel = this.velocity * Math.sin(this.rotation)

        this.type = EntityType.Bullet

        this.scale.set(GlobalScale, GlobalScale)

        this.entityId = 'Bullet' + this._id
    }

    get id() {
        return this._id
    }

    emitGroundHitParticles() {
        const particleManager = ParticleManager.getInstance()

        particleManager.addDustParticles({
            position: { x: this.x, y: this.y }
        })
    }

    demolish() {
        if (this.entityManager !== undefined) {
            this.entityManager.removeEntity(this.entityId, CameraLayer.Bullet)
        }
    }

    demolishWithStyle() {
        this.emitGroundHitParticles()
        this.demolish()
    }
}
