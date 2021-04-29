import { Enemy, EnemyProperties } from '../Enemy'
import { Dimension } from '../../engine/math/Dimension'

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
