import { CameraLayer } from '../../camera/CameraStage'
import { ProjectileSchema } from '../../network/schema/ProjectileSchema'
import { Flogger } from '../../service/Flogger'
import { camera, entityMan } from '../../shared/Dependencies'
import { Bullet } from '../../weapon/projectile/Bullet'
import { IEntityManager } from './EntityManager'

export interface IEntityProjectileCreator {
    createProjectile(schema: ProjectileSchema): Bullet
}

export class EntityProjectileCreator implements IEntityProjectileCreator {

    constructor() {
    }

    createProjectile(schema: ProjectileSchema): Bullet {
        Flogger.log('EntityManager', 'createProjectile', 'id', schema.id)
        
        const bullet = new Bullet({
            id: schema.id,
            rotation: schema.rotation,
        })
        
        bullet.sprite.anchor.set(0.5, 0.5)
        bullet.x = schema.x
        bullet.y = schema.y

        camera.stage.addChildAtLayer(bullet, CameraLayer.Bullet)
        entityMan.registerEntity(schema.id, { clientEntity: bullet, serverEntity: schema })

        return bullet
    }
}
