import { ISprite } from '../../engine/display/Sprite'
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

export interface EntityFlashPluginOptions extends EntityPluginOptions {
    spritesToFlash?: ISprite[]
}

export class EntityFlashPlugin extends EntityPlugin implements IEntityFlashPlugin {
    constructor(options: EntityFlashPluginOptions) {
        super(options)

    }

    update() {

    }

    flash(options: EntityFlashOptions) {
        log('EntityFlashPlugin', 'flash')

        const allSprites = this.entity.getAllSprites()

        for (var i in this.entity.getAllSprites()) {
            const spr = allSprites[i]

            spr.tint = 4*0xFFFFFF
        }

        // const targetSprite = this.entity.sprite

        // if (targetSprite) {
        //     log('EntityFlashPlugin', 'found target sprite')
        //     const shouldRandomize = options.randomize !== undefined ? options.randomize : true
        //     const maximum = options.maximumBrightness !== undefined ? options.maximumBrightness : 1
        //     const minimum = maximum - options.minimumBrightness
        //     const randomizer = shouldRandomize ? Math.random() : 1
        //     const newBrightness = (randomizer * maximum) + minimum

        //     targetSprite.tint = 4*0xFFFFFF
        // }
    }
}
