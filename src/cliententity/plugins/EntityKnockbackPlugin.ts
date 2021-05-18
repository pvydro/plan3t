import { Direction } from '../../engine/math/Direction'
import { log } from '../../service/Flogger'
import { EntityPlugin, EntityPluginOptions, IEntityPlugin } from './EntityPlugin'

export interface IEntityKnockbackPlugin extends IEntityPlugin {
    knockback(options: EntityKnockbackOptions): void
}

export interface EntityKnockbackOptions {
    knockbackAmount?: number
    direction: Direction
}

export class EntityKnockbackPlugin extends EntityPlugin implements IEntityKnockbackPlugin {
    private static DefaultKnockback: number = 2

    constructor(options: EntityPluginOptions) {
        super(options)
    }

    knockback(options: EntityKnockbackOptions) {
        log('EntityKnockbackPlugin', 'knockback', 'options', options)

        const knockbackAmount = (options.knockbackAmount ?? EntityKnockbackPlugin.DefaultKnockback)
            * options.direction

        this.entity.xVel += knockbackAmount
    }
}
