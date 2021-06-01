import { AssetUrls } from '../../../asset/Assets'
import { TextStyles } from '../../../engine/display/TextStyles'
import { IReposition } from '../../../interface/IReposition'
import { RoomManager } from '../../../manager/roommanager/RoomManager'
import { log } from '../../../service/Flogger'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { InGameHUD } from '../../ingamehud/InGameHUD'
import { InGameScreenID } from '../../ingamemenu/InGameMenu'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IRespawnButton extends IUIButton {

}

export class RespawnButton extends UIButton implements IRespawnButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            text: {
                text: 'Respawn',
                uppercase: true,
                offsetY: -3,
                alpha: 0.5,
                style: TextStyles.MetalButton.Medium,
            },
            background: {
                idle: AssetUrls.ButtonMetalMd
            },
            darkenerOptions: {
                hoverTint: 0xdbdbdb,
                clickTint: 0x969696
            },
            tooltipOptions: {
                text: 'RESPAWN',
            }
        })

        this.reposition(true)
    }

    trigger() {
        log('RespawnButton', 'trigger')

        super.trigger()

        InGameHUD.getInstance().closeMenuScreen(InGameScreenID.RespawnScreen)
        RoomManager.getInstance().requestClientPlayerRespawn()
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const scaledWidth = this.backgroundWidth * UIDefaults.UIScale

        this.pos = {
            x: GameWindow.width - UIDefaults.UIEdgePadding - scaledWidth ,
            y: GameWindow.height - UIDefaults.UIEdgePadding
        }
    }
}
