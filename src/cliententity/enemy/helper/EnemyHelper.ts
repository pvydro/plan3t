import { IEnemy, Enemy, EnemyProperties } from '../Enemy'
import { IDimension, Dimension } from '../../../engine/math/Dimension'
import { FlyingEnemy } from '../flyingenemy/FlyingEnemy'

export class EnemyHelper {
    private constructor() {

    }

    static getPropertiesForEnemyType(enemy: Enemy) {
        let properties: EnemyProperties = EnemyHelper.getDefaultProperties()

        if (enemy instanceof FlyingEnemy) {
            properties.dimension = new Dimension(128, 128)
        }

        return properties
    }

    private static getDefaultProperties(): EnemyProperties {
        const properties: EnemyProperties = {
            dimension: new Dimension(24, 24)
        }

        return properties
    }
}
