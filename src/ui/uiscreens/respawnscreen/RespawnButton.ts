import { AssetUrls } from '../../../asset/Assets'
import { Fonts } from '../../../asset/Fonts'
import { TextSpriteAlign } from '../../../engine/display/TextSprite'
import { UIConstants, WindowSize } from '../../../utils/Constants'
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
            },
            background: {
                idle: AssetUrls.MID_BUTTON_METAL
            },
            darkenerPluginOptions: {
                hoverTint: 0xdbdbdb,
                clickTint: 0x969696
            },
            onTrigger: () => {
                console.log('Respawn!')
            }
        })

        const padding = UIConstants.HUDPadding

        this.x = WindowSize.width - padding
        this.y = WindowSize.height - padding
    }
}
