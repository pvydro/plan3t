import { AssetUrls } from '../../../asset/Assets'
import { Flogger } from '../../../service/Flogger'
import { UIConstants, WindowSize } from '../../../utils/Constants'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IRespawnButton extends IUIButton {

}

export class RespawnButton extends UIButton implements IRespawnButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            anchor: { x: 1, y: 0 },
            addClickListeners: true,
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
        this.y = 20
    }
}
