import { CameraLayer } from '../../camera/CameraStage'
import { ProjectileSchema } from '../../network/schema/ProjectileSchema'
import { Flogger } from '../../service/Flogger'
import { camera } from '../../shared/Dependencies'
import { Bullet } from '../../weapon/projectile/Bullet'
import { IEntityManager } from './EntityManager'

export interface IEntityProjectileCreator {
    createProjectile(schema: ProjectileSchema): Bullet
}

export interface EntityProjectileCreatorOptions {
    entityManager: IEntityManager
}

export class EntityProjectileCreator implements IEntityProjectileCreator {
    entityManager: IEntityManager

    constructor(options: EntityProjectileCreatorOptions) {
        this.entityManager = options.entityManager
    }

    createProjectile(schema: ProjectileSchema): Bullet {
        Flogger.log('EntityManager', 'createProjectile')
        
        const bullet = new Bullet({
            id: schema.id,
            rotation: schema.rotation,
            entityManager: this.entityManager
        })
        
        bullet.sprite.anchor.set(0.5, 0.5)
        bullet.x = schema.x
        bullet.y = schema.y

        camera.stage.addChildAtLayer(bullet, CameraLayer.Bullet)
        this.entityManager.registerEntity(schema.id, bullet)

        return bullet
    }
}
