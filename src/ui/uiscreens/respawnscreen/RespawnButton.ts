import { AssetUrls } from '../../../asset/Assets'
import { Fonts } from '../../../asset/Fonts'
import { IReposition } from '../../../interface/IReposition'
import { RoomManager } from '../../../manager/roommanager/RoomManager'
import { Flogger } from '../../../service/Flogger'
import { WindowSize } from '../../../utils/Constants'
import { Defaults } from '../../../utils/Defaults'
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
                    fontFamily: Fonts.Font.family,
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
            },
            onTrigger: () => {
                this.triggerRespawn()
            }
        })

        this.reposition(true)
    }

    triggerRespawn() {
        Flogger.log('RespawnButton', 'triggerRespawn')

        const hud = InGameHUD.getInstance()
        const roomManager = RoomManager.getInstance()

        hud.closeMenuScreen(InGameScreenID.RespawnScreen)
        roomManager.requestClientPlayerRespawn()
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        this.x = WindowSize.width - Defaults.UIEdgePadding
        this.y = WindowSize.height - Defaults.UIEdgePadding
    }
}
