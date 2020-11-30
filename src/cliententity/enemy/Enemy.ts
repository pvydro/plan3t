import { EntityType, IClientEntity, ClientEntity, ClientEntityOptions } from '../ClientEntity'
import { Entity } from '../../network/rooms/Entity'
import { EnemyHelper } from './helper/EnemyHelper'
import { IDimension } from '../../math/Dimension'

export interface IEnemy extends IClientEntity {

}

export interface EnemyOptions extends ClientEntityOptions {

}

export interface EnemyProperties {
    dimension?: IDimension
}

// TODO: Abstract
export abstract class Enemy extends ClientEntity implements IEnemy {
    constructor(options?: EnemyOptions) {
        super(options)

        const enemyProperties = EnemyHelper.getPropertiesForEnemyType(this)

        this.applyEnemyProperties(enemyProperties)
    }

    applyEnemyProperties(properties: EnemyProperties) {
        this.dimension = properties.dimension
    }
}
