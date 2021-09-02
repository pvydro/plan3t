import { AssetUrls } from '../../asset/Assets'
import { Graphix } from '../../engine/display/Graphix'
import { TextSpriteAlign } from '../../engine/display/TextSprite'
import { TextStyles } from '../../engine/display/TextStyles'
import { UIButton, UIButtonOptions, UIButtonType } from './UIButton'

export interface IUIHoloButton {

}

export interface UIHoloButtonOptions extends UIButtonOptions {

}

export class UIHoloButton extends UIButton implements IUIHoloButton {
    backgroundGraphics: Graphix

    constructor(options?: UIHoloButtonOptions) {
        options = UIHoloButton.applyDefaults(options)

        super(options)
    }

    private static applyDefaults(options: UIHoloButtonOptions): UIHoloButtonOptions {
        options.type = options.type ?? UIButtonType.Tap
        options.background = {
            idle: AssetUrls.ButtonRectSmall,
            hovered: AssetUrls.ButtonRectSmallHovered

        }
        if (options.text) {
            options.text.uppercase = options.text.uppercase ?? true
            options.text.style = options.text.style ?? TextStyles.DefaultButton.Small
            options.text.align = options.text.align ?? TextSpriteAlign.Left
        }

        return options
    }
}
