import { IUIButton, UIButton, UIButtonOptions, UIButtonType } from './UIButton'
import { AssetUrls } from '../../asset/Assets'
import { TextStyles } from '../../engine/display/TextStyles'
import { TextSpriteAlign } from '../../engine/display/TextSprite'

export interface IUIWoodButton extends IUIButton {

}

export class UIWoodButton extends UIButton implements IUIWoodButton {
    constructor(options: UIButtonOptions) {
        options = UIWoodButton.applyDefaults(options)

        super(options)
    }

    private static applyDefaults(options: UIButtonOptions): UIButtonOptions {
        options.type = options.type ?? UIButtonType.Tap
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
