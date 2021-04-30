import { EnemyHelper } from './helper/EnemyHelper'
import { IDimension } from '../engine/math/Dimension'
import { ITravelkinCreature, TravelkinCreature, TravelkinCreatureOptions } from '../creature/travelkin/TravelkinCreature'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'

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

    takeDamage(damageAmount: number) {
        const particleManager = ParticleManager.getInstance()
        const damageString = '-' + damageAmount
        
        particleManager.addTextParticle({
            text: damageString,
            position: { x: this.x, y: this.y },
            positionRandomization: { randomizationRange: 32 }
        })
    }
}
