import { AssetUrls } from '../../../asset/Assets'
import { UIConstants, WindowSize } from '../../../utils/Constants'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IRespawnButton extends IUIButton {

}

export class RespawnButton extends UIButton implements IRespawnButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            anchor: { x: 1, y: 0 },
            background: {
                idle: AssetUrls.MID_BUTTON_METAL
            },
            onTrigger: () => {
                console.log('Respawn!')
            },
            onHover: () => {
                console.log('Hover...')
            },
            onMouseOut: () => {
                console.log('Mouse out!')
            },
            onRelease: () => {
                console.log('release.')
            }
        })

        const padding = UIConstants.HUDPadding

        this.x = WindowSize.width - padding
        this.y = 20
    }
}
