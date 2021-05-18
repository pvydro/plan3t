import { EnemyHelper } from './helper/EnemyHelper'
import { IDimension } from '../engine/math/Dimension'
import { ITravelkinCreature, TravelkinCreature, TravelkinCreatureOptions } from '../creature/travelkin/TravelkinCreature'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { Bullet } from '../weapon/projectile/Bullet'
import { Camera } from '../camera/Camera'
import { EntityManager } from '../manager/entitymanager/EntityManager'
import { asyncTimeout } from '../utils/Utils'

export interface IEnemy extends ITravelkinCreature {

}

export interface EnemyOptions extends TravelkinCreatureOptions {

}

export interface EnemyProperties {
    dimension?: IDimension
}

export abstract class Enemy extends TravelkinCreature implements IEnemy {
    static EnemyIdIteration: number = 0

    constructor(options: EnemyOptions) {
        super(options)

        const enemyProperties = EnemyHelper.getPropertiesForEnemyType(this) // TODO: Remove this

        this.applyEnemyProperties(enemyProperties)
        this.entityId = 'Enemy' + Enemy.EnemyIdIteration++
    }

    applyEnemyProperties(properties: EnemyProperties) {
        this.dimension = properties.dimension
    }

    takeDamage(damage: number | Bullet) {
        super.takeDamage(damage)

        const camera = Camera.getInstance()
        const dmg = (damage instanceof Bullet) ? damage.damage : damage
        const particleManager = ParticleManager.getInstance()
        const damageString = '-' + dmg
        
        camera.shakeAndFlash(2.5)

        particleManager.addTextParticle({
            text: damageString,
            position: { x: this.x, y: this.y },
            positionRandomization: { randomizationRange: 32 }
        })
        particleManager.addBloodParticles({
            position: { x: this.x, y: this.y },
            positionRandomization: { randomizationRange: 8 }
        })
    }

    async die() {
        ParticleManager.getInstance().addDeathSkullParticle({
            position: { x: this.x, y: this.y },
            positionRandomization: { randomizationRange: 8 }
        })
        await super.die()


        const enemyManager = EntityManager.getInstance().enemyManager
        enemyManager.removeEnemy(this)
    }
}
