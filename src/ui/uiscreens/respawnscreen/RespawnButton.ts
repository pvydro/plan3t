import { AssetUrls } from '../../../asset/Assets'
import { Fonts } from '../../../asset/Fonts'
import { IReposition } from '../../../interface/IReposition'
import { RoomManager } from '../../../manager/roommanager/RoomManager'
import { log } from '../../../service/Flogger'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { InGameHUD } from '../../ingamehud/InGameHUD'
import { InGameScreenID } from '../../ingamemenu/InGameMenu'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IRespawnButton extends IUIButton, IReposition {

}

export class RespawnButton extends UIButton implements IRespawnButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            anchor: {
                x: 1, y: 1
            },
            text: {
                text: 'Respawn',
                uppercase: true,
                offsetY: 3,
                alpha: 0.5,
                style: {
                    fontFamily: Fonts.FontDefault.family,
                    fontSize: 18,
                    color: 0x000000
                }
            },
            background: {
                idle: AssetUrls.MID_BUTTON_METAL
            },
            darkenerPluginOptions: {
                hoverTint: 0xdbdbdb,
                clickTint: 0x969696
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

        this.x = GameWindow.width - UIDefaults.UIEdgePadding
        this.y = GameWindow.height - UIDefaults.UIEdgePadding
    }
}
