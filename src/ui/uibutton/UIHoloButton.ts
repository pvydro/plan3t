import { AssetUrls } from '../../asset/Assets'
import { Graphix } from '../../engine/display/Graphix'
import { TextSpriteAlign } from '../../engine/display/TextSprite'
import { TextStyles } from '../../engine/display/TextStyles'
import { UIButton, UIButtonOptions, UIButtonType } from './UIButton'

export interface IUIHoloButton {

}

export interface IUIHoloButtonOptions extends UIButtonOptions {

}

export class UIHoloButton extends UIButton implements IUIHoloButton {
    backgroundGraphics: Graphix

    constructor(options?: IUIHoloButtonOptions) {super({
        type: UIButtonType.Tap,
        text: {
            text: options.text.text,
            uppercase: options.text.uppercase ?? true,
            style: options.text.style ?? TextStyles.DefaultButton.Small,
            align: options.text.align ?? TextSpriteAlign.Left
        },
        background: {
            idle: AssetUrls.ButtonRectSmall,
            hovered: AssetUrls.ButtonRectSmallHovered
        },
        onHover: () => options.onHover,
        // darkenerOptions: {
        //     hoverTint: 0xdbdbdb,
        //     clickTint: 0x969696
        // },
        onTrigger: () => options.onTrigger
    })
    }
}
