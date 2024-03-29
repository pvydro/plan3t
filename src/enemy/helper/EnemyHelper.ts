import { Enemy } from '../Enemy'
import { Dimension, IDimension } from '../../engine/math/Dimension'

export interface EnemyProperties {
    dimension?: IDimension
}

export class EnemyHelper {
    private constructor() {

    }

    static getWalkingSheetForEnemy() {
        // TODO: This
    }

    static getPropertiesForEnemyType(enemy: Enemy) {
        let properties: EnemyProperties = EnemyHelper.getDefaultProperties()

        // if (enemy instanceof FlyingEnemy) { // FIXME: This causes null/undefined error
        //     properties.dimension = new Dimension(128, 128)
        // }

        return properties
    }

    private static getDefaultProperties(): EnemyProperties {
        const properties: EnemyProperties = {
            dimension: new Dimension(24, 24)
        }

        return properties
    }
}
