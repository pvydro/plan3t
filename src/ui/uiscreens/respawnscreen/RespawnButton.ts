import { AssetUrls } from '../../../asset/Assets'
import { Fonts } from '../../../asset/Fonts'
import { TextSpriteAlign } from '../../../engine/display/TextSprite'
import { RoomManager } from '../../../manager/roommanager/RoomManager'
import { Flogger } from '../../../service/Flogger'
import { UIConstants, WindowSize } from '../../../utils/Constants'
import { InGameHUD } from '../../ingamehud/InGameHUD'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IRespawnButton extends IUIButton {

}

export class RespawnButton extends UIButton implements IRespawnButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            addClickListeners: true,
            anchor: {
                x: 1, y: 1
            },
            text: {
                text: 'RESPAWN',
                fontFamily: Fonts.Font.family,
                fontSize: 18,
                color: 0x000000,
                offsetY: -3,
                alpha: 0.5
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

        const padding = UIConstants.HUDPadding

        this.x = WindowSize.width - padding
        this.y = WindowSize.height - padding
    }

    triggerRespawn() {
        Flogger.log('RespawnButton', 'triggerRespawn')

        const hud = InGameHUD.getInstance()
        const roomManager = RoomManager.getInstance()

        hud.closeRespawnScreen()
        roomManager.requestClientPlayerRespawn()
    }
}
