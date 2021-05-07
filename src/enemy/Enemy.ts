import { EnemyHelper } from './helper/EnemyHelper'
import { IDimension } from '../engine/math/Dimension'
import { ITravelkinCreature, TravelkinCreature, TravelkinCreatureOptions } from '../creature/travelkin/TravelkinCreature'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { Bullet } from '../weapon/projectile/Bullet'

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

    takeDamage(damageAmount: number | Bullet) {
        super.takeDamage(damageAmount)

        const dmg = (damageAmount instanceof Bullet) ? damageAmount.damage : damageAmount
        const particleManager = ParticleManager.getInstance()
        const damageString = '-' + dmg
        
        particleManager.addTextParticle({
            text: damageString,
            position: { x: this.x, y: this.y },
            positionRandomization: { randomizationRange: 32 }
        })
    }
}
