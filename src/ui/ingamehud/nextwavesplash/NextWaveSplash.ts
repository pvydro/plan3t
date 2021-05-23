import { TextStyles } from '../../../engine/display/TextStyles'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'

export interface INextWaveSplash extends IUIComponent {

}

export class NextWaveSplash extends UIComponent implements INextWaveSplash {
    nextWaveText: UIText

    constructor() {
        super()     // TODO: Filters?

        this.nextWaveText = new UIText({
            text: 'next wave',
            style: TextStyles.Menu.HeaderBig
        })

        this.addChild(this.nextWaveText)
    }

    reposition(addListeners?: boolean) {
        this.nextWaveText.x = (GameWindow.width / UIDefaults.UIScale) - this.nextWaveText.textWidth
        this.nextWaveText.y = (GameWindow.height / 2) / UIDefaults.UIScale

        super.reposition(addListeners)
    }
}
