import { TextStyles } from '../../engine/display/TextStyles'
import { IUIComponent, UIComponent } from '../UIComponent'
import { UIText } from '../UIText'

export interface ILoadingIcon extends IUIComponent {
    textHeight: number
    textWidth: number
}

export class LoadingIcon extends UIComponent implements ILoadingIcon {
    text: UIText

    constructor() {
        super()

        this.text = new UIText({
            text: 'Loading',
            uppercase: true,
            style: TextStyles.Menu.HeaderMedium
        })
        
        this.addChild(this.text)
    }

    get textWidth() {
        return this.text.scaledTextWidth
    }

    get textHeight() {
        return this.text.scaledTextHeight
    }
}
