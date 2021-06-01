import { AssetUrls } from '../../../asset/Assets'
import { TextStyles } from '../../../engine/display/TextStyles'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IPlayButton extends IUIButton {

}

export class PlayButton extends UIButton implements IPlayButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            text: {
                text: 'Play',
                uppercase: true,
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
                text: 'PLAY',
            }

        })
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
    }
}
