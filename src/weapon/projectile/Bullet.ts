import { Assets, AssetUrls } from '../../asset/Assets'
import { CameraLayer } from '../../camera/CameraStage'
import { EntityType } from '../../cliententity/ClientEntity'
import { GravityEntity, IGravityEntity } from '../../cliententity/GravityEntity'
import { Sprite } from '../../engine/display/Sprite'
import { IEntityManager } from '../../manager/entitymanager/EntityManager'
import { entityMan, particleMan } from '../../shared/Dependencies'
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
    id: string
    rotation?: number
    velocity?: number
    damaage?: number
    entityManager?: IEntityManager
}

export class Bullet extends GravityEntity implements IBullet {
    _id: string
    damage: number

    constructor(options?: BulletOptions) {
        const assetUrl = Assets.get(AssetUrls.ProjectileBullet)
        const sprite = new Sprite({ texture: PIXI.Texture.from(assetUrl) })
        sprite.anchor.set(0.5, 0.5)
        super({
            sprite,
            addDebugRectangle: true,
            boundingBoxAnchor: { x: 0.5, y: 0.5 }
        })
        
        this._id = options.id
        this.entityId = 'Bullet' + this._id
        this.rotation = options.rotation ?? 0
        this.damage = options.damaage ?? 10
        this.targetServerLerpRate = 0.75
        this.type = EntityType.Bullet
        this.scale.set(GlobalScale, GlobalScale)
    }

    get id() {
        return this._id
    }

    emitGroundHitParticles() {
        particleMan.addDustParticle({
            position: { x: this.x, y: this.y }
        })
    }

    demolish() {
        entityMan.removeEntity(this.entityId, CameraLayer.Bullet)
    }

    demolishWithStyle() {
        this.emitGroundHitParticles()
        this.demolish()
    }
}
