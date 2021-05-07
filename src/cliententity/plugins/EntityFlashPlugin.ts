import { IUpdatable } from '../../interface/IUpdatable'
import { log } from '../../service/Flogger'
import { EntityPlugin, EntityPluginOptions, IEntityPlugin } from './EntityPlugin'

export interface IEntityFlashPlugin extends IEntityPlugin, IUpdatable {
    flash(options: EntityFlashOptions): void
}

export interface EntityFlashOptions {
    minimumBrightness?: number
    maximumBrightness?: number
    randomize?: boolean
}

export class EntityFlashPlugin extends EntityPlugin implements IEntityFlashPlugin {
    constructor(options: EntityPluginOptions) {
        super(options)
    }

    update() {

    }

    flash(options: EntityFlashOptions) {
        log('EntityFlashPlugin', 'flash')

        const shouldRandomize = options.randomize !== undefined ? options.randomize : true
        const maximum = options.maximumBrightness !== undefined ? options.maximumBrightness : 1
        const minimum = maximum - options.minimumBrightness
        const randomizer = shouldRandomize ? Math.random() : 1
        const newBrightness = (randomizer * maximum) + minimum
    }
}
