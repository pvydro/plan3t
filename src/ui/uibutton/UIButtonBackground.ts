import { Assets } from '../../asset/Assets'
import { Container } from '../../engine/display/Container'
import { ISprite, Sprite } from '../../engine/display/Sprite'
import { importantLog } from '../../service/Flogger'
import { IUIButton, UIButtonBackgroundOptions, UIButtonState } from './UIButton'

export interface IUIButtonBackground {
    backgroundSprite: ISprite
    allBackgrounds: ISprite[]
    refreshBackgroundBasedOnState(value: UIButtonState): void
}

export interface UIButtonBackgroundContainerOptions {
    button: IUIButton
}

export class UIButtonBackground extends Container implements IUIButtonBackground {
    _backgroundSprite?: Sprite
    _backgroundSpriteHovered?: Sprite
    _backgroundSpriteTriggered?: Sprite
    _allSprites: ISprite[] = []

    constructor() {
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
                    this.backgroundSpriteHovered.alpha = 0
                }
                if (triggered !== undefined && (background.triggered !== background.hovered || !background.hovered)) {
                    this.backgroundSpriteTriggered = new Sprite({ texture: triggered })
                    this.backgroundSpriteTriggered.alpha = 0
                }
            } else if (background.graphic !== undefined) {
                this.backgroundSprite = new Sprite({ texture: background.graphic })
            }
        }

        this._allSprites = [ this._backgroundSprite, this._backgroundSpriteHovered, this._backgroundSpriteTriggered ]
    }

    refreshBackgroundBasedOnState(value: UIButtonState) {
        importantLog('refreshBackgroundBasedOnState', 'state', UIButtonState[value])

        this.backgroundSprite.alpha = 0
        this.backgroundSpriteHovered.alpha = 0
        this.backgroundSpriteTriggered.alpha = 0

        let selectedBackground
        switch (value) {
            case UIButtonState.Hovered:
                selectedBackground = this.backgroundSpriteHovered
                break
            case UIButtonState.Triggered:
                selectedBackground = this.backgroundSpriteTriggered
                break
            default:
            case UIButtonState.Idle:
                selectedBackground = this.backgroundSprite
                break
        }

        selectedBackground.alpha = 1
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

    get backgroundSprite() {
        return this._backgroundSprite
    }

    get backgroundSpriteHovered() {
        return this._backgroundSpriteHovered ?? this._backgroundSprite
    }

    get backgroundSpriteTriggered() {
        return this._backgroundSpriteTriggered ?? (this.backgroundSpriteHovered ?? this._backgroundSprite)
    }

    get allBackgrounds() {
        return this._allSprites
        // return [
        //     this.backgroundSprite,
        // ]
    }
}
