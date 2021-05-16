import { AssetUrls } from '../../../asset/Assets'
import { FourWayDirection } from '../../../engine/math/Direction'
import { log } from '../../../service/Flogger'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { UIButton, UIButtonState, UIButtonType } from '../../uibutton/UIButton'
import { CrosshairState } from '../crosshair/Crosshair'
import { InGameHUD } from '../InGameHUD'
export interface IPauseButton {

}

export class PauseButton extends UIButton implements IPauseButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            background: {
                idle: AssetUrls.PauseButton
            },
            tooltipOptions: {
                text: 'Pause',
                uppercase: true,
                side: FourWayDirection.Left,
                showOnHover: true
            }
        })
    }

    trigger() {
        log('PauseButton', 'trigger')

        super.trigger()
    }

    async hover() {
        if (this.state !== UIButtonState.Hovered) {
            InGameHUD.getInstance().requestCrosshairState(CrosshairState.Cursor)
        }
        
        super.hover()
    }

    async unhover() {
        if (this.state !== UIButtonState.Idle) {
            InGameHUD.getInstance().requestCrosshairState(CrosshairState.Gameplay)
        }

        super.unhover()
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const rightMargin = UIDefaults.UIEdgePadding
        const scaledWidth = this.backgroundWidth * UIDefaults.UIScale

        this.pos = {
            x: GameWindow.fullWindowWidth - rightMargin - scaledWidth,
            y: -UIDefaults.UIBleedPastBorderMargins.small
        }
    }
}
