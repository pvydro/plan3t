import * as PIXI from 'pixi.js'
import { IUIButton, UIButton, UIButtonOptions, UIButtonType } from './UIButton'
import { Assets, AssetUrls } from '../../asset/Assets'
import { TextStyles } from '../../engine/display/TextStyles'
import { TextSpriteAlign } from '../../engine/display/TextSprite'
import { Sprite } from '../../engine/display/Sprite'
import { IVector2 } from '../../engine/math/Vector2'

export interface IUIWoodButton extends IUIButton {

}

export class UIWoodButton extends UIButton implements IUIWoodButton {
    seedSprite?: Sprite
    seedPreClickPosition: IVector2

    constructor(options: UIButtonOptions) {
        options = UIWoodButton.applyDefaults(options)

        super(options)

        this.createDecor()
    }

    createDecor() {
        const shouldAddSeed = Math.random() > 0.5
        const bottomShadingSectionSize = 5
        const borderSize = 2

        if (shouldAddSeed) {
            
            this.seedSprite = new Sprite({
                texture: PIXI.Texture.from(Assets.get(AssetUrls.ButtonDecorWoodSeed))
            })

            const seedPos: IVector2 = {
                x: Math.floor(Math.random() * (this.width - this.seedSprite.width - (borderSize * 2))) + borderSize,
                y: (Math.floor(Math.random() * (this.height - this.seedSprite.height - bottomShadingSectionSize - borderSize)) + borderSize)
            }

            this.addChildAt(this.seedSprite, 1)
            this.seedSprite.position.set(seedPos.x, seedPos.y)
            this.seedPreClickPosition = seedPos
        }
    }

    applyClickOffset(shouldApply: boolean) {
        if (this.seedSprite) {
            if (shouldApply) {
                this.seedSprite.y = this.seedPreClickPosition.y + this.clickedOffsetY
            } else {
                this.seedSprite.y = this.seedPreClickPosition.y
            }
        }
        
        super.applyClickOffset(shouldApply)
    }

    private static applyDefaults(options: UIButtonOptions): UIButtonOptions {
        options.type = options.type ?? UIButtonType.Tap
        options.clickedOffsetY = options.clickedOffsetY ?? 1
        options.darkenerOptions = { shouldDarken: true }
        options.text = { ...options.text, offsetY: -2 }
        options.background = {
            idle: AssetUrls.ButtonWood,
            triggered: AssetUrls.ButtonWoodClicked
        }

        if (options.text) {
            options.text.uppercase = options.text.uppercase ?? true
            options.text.style = options.text.style ?? TextStyles.DefaultButton.Small
            options.text.align = options.text.align ?? TextSpriteAlign.Center
        }

        return options
    }
}
