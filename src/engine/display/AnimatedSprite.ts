import * as PIXI from 'pixi.js'
import { Assets } from '../../asset/Assets'
import { IDimension } from '../math/Dimension'
import { IVector2 } from '../math/Vector2'
import { Graphix } from './Graphix'
import { ISprite } from './Sprite'
import { ISpritesheet, Spritesheet } from './spritesheet/Spritesheet'

export interface IAnimatedSprite extends ISprite {
    anchor: IVector2
    flipX(): void
    flipY(): void
}

export interface AnimationOptions {
    animationSpeed?: number
    loop?: boolean
}

export interface AnimatedSpriteOptions extends AnimationOptions {
    textureUrls?: string[]
    sheet?: Spritesheet | any
    dimension?: IDimension
}

export class AnimatedSprite extends PIXI.AnimatedSprite implements IAnimatedSprite {
    overlayGraphic?: Graphix

    constructor(options: AnimatedSpriteOptions) {
        let data = options.sheet ?? []

        if (options.sheet instanceof Spritesheet) {

            data = options.sheet.animation

        } else if (!options.sheet && options.textureUrls && options.textureUrls.length > 0) {

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

    flipX() {
        this.scale.x *= -1
    }

    flipY() {
        this.scale.y *= -1
    }

    demolish() {
        throw new Error('Method not implemented.')
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
