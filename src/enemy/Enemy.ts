import { EnemyHelper } from './helper/EnemyHelper'
import { IDimension } from '../engine/math/Dimension'
import { ITravelkinCreature, TravelkinCreature, TravelkinCreatureOptions } from '../creature/travelkin/TravelkinCreature'

export interface IEnemy extends ITravelkinCreature {

}

export interface EnemyOptions extends TravelkinCreatureOptions {

}

export interface EnemyProperties {
    dimension?: IDimension
}

export abstract class Enemy extends TravelkinCreature implements IEnemy {
    static EnemyIdIteration: number = 0

    constructor(options?: EnemyOptions) {
        super(options)

        const enemyProperties = EnemyHelper.getPropertiesForEnemyType(this)

        this.applyEnemyProperties(enemyProperties)
        this.entityId = 'Enemy' + Enemy.EnemyIdIteration++
    }

    applyEnemyProperties(properties: EnemyProperties) {
        this.dimension = properties.dimension
    }
}
