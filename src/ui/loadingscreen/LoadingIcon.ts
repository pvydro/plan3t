import { TextStyles } from '../../engine/display/TextStyles'
import { IUIComponent, UIComponent } from '../UIComponent'
import { UIText } from '../UIText'

export interface ILoadingIcon extends IUIComponent {

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
}
