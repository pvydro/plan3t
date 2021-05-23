import { TextStyles } from '../../../engine/display/TextStyles'
import { Tween } from '../../../engine/display/tween/Tween'
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
            style: TextStyles.NextWaveHeader
        })

        this.addChild(this.nextWaveText)
        this.forceHide()
    }

    reposition(addListeners?: boolean) {
        const rightMargin = UIDefaults.UIEdgePadding / UIDefaults.UIScale

        this.nextWaveText.x = (GameWindow.width / UIDefaults.UIScale) - this.nextWaveText.textWidth - rightMargin
        this.nextWaveText.y = ((GameWindow.height / 2) / UIDefaults.UIScale) - this.nextWaveText.halfTextHeight

        super.reposition(addListeners)
    }

    async show() {
        await Tween.to(this, { alpha: 1, duration: 0.5, autoplay: true })
    }

    async hide() {
        await Tween.to(this, { alpha: 0, duration: 0.5, autoplay: true })
    }
}
