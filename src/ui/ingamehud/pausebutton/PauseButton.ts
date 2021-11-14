import { AssetUrls } from '../../../asset/Assets'
import { FourWayDirection } from '../../../engine/math/Direction'
import { log } from '../../../service/Flogger'
import { inGameHUD } from '../../../shared/Dependencies'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { IUIButton, UIButton, UIButtonState, UIButtonType } from '../../uibutton/UIButton'
import { CrosshairState } from '../crosshair/Crosshair'

export interface IPauseButton extends IUIButton {

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
                showOnHover: true,
                yOffset: -2,
                xOffset: 4
            },
            nudgeOptions: {
                yNudgeOnClick: 4
            }
        })
    }

    trigger() {
        log('PauseButton', 'trigger')

        super.trigger()
    }

    async hover() {
        if (this.state !== UIButtonState.Hovered) {
            inGameHUD.requestCrosshairState(CrosshairState.Cursor)
        }
        
        super.hover()
    }

    async unhover() {
        if (this.state !== UIButtonState.Idle) {
            inGameHUD.requestCrosshairState(CrosshairState.Gameplay)
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
