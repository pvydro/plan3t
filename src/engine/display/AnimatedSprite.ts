import * as PIXI from 'pixi.js'
import { Assets } from '../../asset/Assets'
import { IDimension } from '../math/Dimension'

export interface IAnimatedSprite {

}

export interface AnimationOptions {
    animationSpeed?: number
    loop?: boolean
}

export interface AnimatedSpriteOptions extends AnimationOptions {
    textureUrls?: string[]
    sheet?: any
    dimension?: IDimension
}

export class AnimatedSprite extends PIXI.AnimatedSprite implements IAnimatedSprite {
    constructor(options: AnimatedSpriteOptions) {
        let data = options.sheet ?? []
        if (!options.sheet && options.textureUrls && options.textureUrls.length > 0) {
            for (let i = 0; i < options.textureUrls.length; i++) {
                let texture = PIXI.Texture.from(Assets.get(options.textureUrls[i]))
                data.push(texture)
            }
        }
        super(data)

        if (options.dimension !== undefined) this.dimension = options.dimension
        if (options.animationSpeed !== undefined) this.animationSpeed = options.animationSpeed
        if (options.loop !== undefined) this.loop = options.loop
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
