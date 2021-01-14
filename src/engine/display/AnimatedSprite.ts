import * as PIXI from 'pixi.js'
import { IDimension } from '../math/Dimension'

export interface IAnimatedSprite {

}

export interface AnimatedSpriteOptions {
    sheet: any
    dimension?: IDimension
}

export class AnimatedSprite extends PIXI.AnimatedSprite implements IAnimatedSprite {
    constructor(options: AnimatedSpriteOptions) {
        super(options.sheet)

        if (options.dimension) {
            this.dimension = options.dimension
        }
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
