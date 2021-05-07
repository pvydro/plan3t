import { log } from '../../service/Flogger'
import { EntityPlugin, EntityPluginOptions, IEntityPlugin } from './EntityPlugin'

export interface IEntityKnockbackPlugin extends IEntityPlugin {
    knockback(options?: EntityKnockbackOptions): void
}

export interface EntityKnockbackOptions {
    knockbackAmount?: number
}

export class EntityKnockbackPlugin extends EntityPlugin implements IEntityKnockbackPlugin {
    constructor(options: EntityPluginOptions) {
        super(options)
    }

    knockback(options: EntityKnockbackOptions) {
        options = options ?? { knockbackAmount: 15 }

        log('EntityKnockbackPlugin', 'knockback', 'options', options)

        this.entity.xVel = options.knockbackAmount
    }
}
