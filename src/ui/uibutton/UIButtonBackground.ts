import { Assets } from '../../asset/Assets'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { Sprite } from '../../engine/display/Sprite'
import { IUIButton, UIButtonBackgroundOptions } from './UIButton'

export interface IUIButtonBackground {

}

export interface UIButtonBackgroundContainerOptions {
    button: IUIButton
}

export class UIButtonBackground extends Container {
    _backgroundSprite?: Sprite
    _backgroundSpriteHovered?: Sprite
    _backgroundSpriteTriggered?: Sprite

    constructor(options: UIButtonBackgroundContainerOptions) {
        super()
    }

    applyBackgroundTexture(options: UIButtonBackgroundOptions) {
        if (options !== undefined) {
            const background = options

            if (background.idle !== undefined) {
                const idle = PIXI.Texture.from(Assets.get(background.idle))
                const hovered = background.hovered ? PIXI.Texture.from(Assets.get(background.hovered)) : undefined
                const triggered = background.triggered ? PIXI.Texture.from(Assets.get(background.triggered)) : undefined
    
                this.backgroundSprite = new Sprite({ texture: idle })
                
                if (hovered !== undefined && background.hovered !== background.idle) {
                    this.backgroundSpriteHovered = new Sprite({ texture: hovered })
                }
                if (triggered !== undefined && background.triggered !== background.hovered) {
                    this.backgroundSpriteTriggered = new Sprite({ texture: triggered })
                }
            } else if (background.graphic !== undefined) {
                this.backgroundSprite = new Sprite({ texture: background.graphic })
            }
        }
    }

    set backgroundSprite(value: Sprite) {
        if (this._backgroundSprite !== undefined) {
            this._backgroundSprite.demolish()
            this.removeChild(this._backgroundSprite)
        }

        this._backgroundSprite = value
        this.addChild(this._backgroundSprite)
    }

    set backgroundSpriteHovered(value: Sprite) {
        if (this._backgroundSpriteHovered !== undefined) {
            this.removeChild(this._backgroundSpriteHovered)
        }

        this._backgroundSpriteHovered = value
        this.addChild(this._backgroundSpriteHovered)
    }

    set backgroundSpriteTriggered(value: Sprite) {
        if (this._backgroundSpriteTriggered !== undefined) {
            this.removeChild(this._backgroundSpriteTriggered)
        }

        this._backgroundSpriteTriggered = value
        this.addChild(this._backgroundSpriteTriggered)
    }

    // set backgroundGraphic(value: Graphix) {
    //     if (this._backgroundGraphic !== undefined) {
    //         this.removeChild(this._backgroundGraphic)
    //     }

    //     this._backgroundGraphic = value
    //     this.addChild(this._backgroundGraphic)
    // }

    get backgroundSprite() {
        return this._backgroundSprite
    }

    // get backgroundGraphic() {
    //     return this._backgroundGraphic
    // }
}
