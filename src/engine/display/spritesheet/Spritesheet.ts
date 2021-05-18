import * as PIXI from 'pixi.js'
import { Spritesheets } from '../../../asset/Spritesheets'

export interface ISpritesheet {
    pixiSheet: PIXI.Spritesheet
}

export interface SpritesheetOptions {
    sheetUrl: string
}

export class Spritesheet implements ISpritesheet {
    pixiSheet: PIXI.Spritesheet
    animation: any

    constructor(options: SpritesheetOptions) {
        this.pixiSheet = Spritesheets.get(options.sheetUrl)
        this.animation = this.pixiSheet.animations['tile']
    }
}
