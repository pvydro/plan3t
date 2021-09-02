import { TextSprite, TextSpriteStyle } from '../../engine/display/TextSprite'
import { TextStyles } from '../../engine/display/TextStyles'
import { UIDefaults } from '../../utils/Defaults'
import { IUIComponent, UIComponent } from '../UIComponent'

export interface IScreenHeader extends IUIComponent {

}

export interface UIScreenHeaderOptions {
    text: string
    style?: TextSpriteStyle
}

export class UIScreenHeader extends UIComponent implements IScreenHeader {
    text: string
    textSprite: TextSprite

    constructor(options: UIScreenHeaderOptions) {
        super()

        this.text = options.text
        this.textSprite = new TextSprite({
            style: options.style ?? TextStyles.Menu.HeaderMedium,
            text: options.text,
            uppercase: true
        })

        this.addChild(this.textSprite)

        this.reposition(true)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const scale = UIDefaults.UIScale
        const margin = UIDefaults.UIMargin * scale

        this.pos = margin
    }
}
