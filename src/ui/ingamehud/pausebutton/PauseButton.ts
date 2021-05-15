import { AssetUrls } from '../../../asset/Assets'
import { log } from '../../../service/Flogger'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IPauseButton {

}

export class PauseButton extends UIButton implements IPauseButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            background: {
                idle: AssetUrls.PauseButton
            },
        })
    }

    trigger() {
        log('PauseButton', 'trigger')

        super.trigger()
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const rightMargin = UIDefaults.UIMargin * UIDefaults.UIScale
        const scaledWidth = this.backgroundWidth * UIDefaults.UIScale

        this.pos = {
            x: GameWindow.fullWindowWidth - rightMargin - scaledWidth,
            y: -(scaledWidth / 2)
        }
    }
}
