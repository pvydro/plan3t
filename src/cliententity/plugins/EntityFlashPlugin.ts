import { ISprite } from '../../engine/display/Sprite'
import { IUpdatable } from '../../interface/IUpdatable'
import { log } from '../../service/Flogger'
import { EntityPlugin, EntityPluginOptions, IEntityPlugin } from './EntityPlugin'

export interface IEntityFlashPlugin extends IEntityPlugin, IUpdatable {
    flash(options?: EntityFlashOptions): void
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
    spritesToFlash: ISprite[]
    
    constructor(options: EntityFlashPluginOptions) {
        super(options)

        this.spritesToFlash = this.entity.getAllSprites()
    }

    update() {
        if (this.spritesToFlash.length !== this.entity.getAllSprites().length) {
            this.spritesToFlash = this.entity.getAllSprites()
        }
    }

    flash(options?: EntityFlashOptions) {
        options = options ?? { maximumBrightness: 1, randomize: false }

        log('EntityFlashPlugin', 'flash', 'options', options)

        for (var i in this.spritesToFlash) {
            const spr = this.spritesToFlash[i]

            // spr.tint = 4*0xFFFFFF
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
