import { AssetUrls } from '../../asset/Assets'
import { Graphix } from '../../engine/display/Graphix'
import { TextSpriteAlign } from '../../engine/display/TextSprite'
import { TextStyles } from '../../engine/display/TextStyles'
import { IUIButton, UIButton, UIButtonOptions, UIButtonType } from './UIButton'

export interface IUIHoloButton extends IUIButton {

}

export class UIHoloButton extends UIButton implements IUIHoloButton {
    constructor(options?: UIButtonOptions) {
        options = UIHoloButton.applyDefaults(options)

        super(options)
    }

    private static applyDefaults(options: UIButtonOptions): UIButtonOptions {
        options.type = options.type ?? UIButtonType.Tap
        options.background = {
            idle: AssetUrls.ButtonRoundRectSmall,
            hovered: AssetUrls.ButtonRoundRectSmallHovered

        }
        if (options.text) {
            options.text.uppercase = options.text.uppercase ?? true
            options.text.style = options.text.style ?? TextStyles.DefaultButton.Small
            options.text.align = options.text.align ?? TextSpriteAlign.Left
        }

        return options
    }
}
