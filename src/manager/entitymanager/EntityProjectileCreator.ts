import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Flogger } from '../../service/Flogger'
import { Bullet, ProjectileType } from '../../weapon/projectile/Bullet'
import { IEntityManager } from './EntityManager'

export interface IEntityProjectileCreator {
    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, velocity?: number): Bullet
}

export interface EntityProjectileCreatorOptions {
    entityManager: IEntityManager
}

export class EntityProjectileCreator implements IEntityProjectileCreator {
    entityManager: IEntityManager

    constructor(options: EntityProjectileCreatorOptions) {
        this.entityManager = options.entityManager
    }

    createProjectile(type: ProjectileType, x: number, y: number, rotation: number, velocity?: number): Bullet {
        Flogger.log('EntityManager', 'createProjectile', 'type', ProjectileType[type], 'velocity', velocity)
        
        const bullet = new Bullet({
            rotation, velocity,
            entityManager: this.entityManager
        })
        bullet.sprite.anchor.set(0.5, 0.5)
        bullet.x = x
        bullet.y = y

        this.cameraStage.addChildAtLayer(bullet, CameraLayer.Bullet)
        this.entityManager.registerEntity(bullet.id.toString(), {
            clientEntity: bullet
        })

        return bullet
    }

    get camera(): Camera {
        return this.entityManager.camera
    }

    get cameraStage() {
        return this.camera.stage
    }
}
