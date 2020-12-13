import * as PIXI from 'pixi.js'
import { IDimension } from '../../math/Dimension'

export interface ISprite {

}

export interface SpriteOptions {
    texture: any
    dimension?: IDimension
}

export class Sprite extends PIXI.Sprite implements ISprite {
    constructor(options: SpriteOptions) {
        super(options.texture)

        if (options.dimension) {
            this.dimension = options.dimension
        }
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
