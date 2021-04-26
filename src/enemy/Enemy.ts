import { EntityType, IClientEntity, ClientEntity, ClientEntityOptions } from '../cliententity/ClientEntity'
import { Entity } from '../network/rooms/Entity'
import { EnemyHelper } from './helper/EnemyHelper'
import { IDimension } from '../engine/math/Dimension'
import { Creature, CreatureOptions, CreatureType } from '../creature/Creature'

export interface IEnemy extends IClientEntity {

}

export interface EnemyOptions extends CreatureOptions {
    type:
}

export interface EnemyProperties {
    dimension?: IDimension
}

// TODO: Abstract
export abstract class Enemy extends Creature implements IEnemy {
    constructor(options?: EnemyOptions) {
        super(options)

        const enemyProperties = EnemyHelper.getPropertiesForEnemyType(this)

        this.applyEnemyProperties(enemyProperties)
    }

    applyEnemyProperties(properties: EnemyProperties) {
        this.dimension = properties.dimension
    }
}
