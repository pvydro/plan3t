import { AssetUrls } from '../../../asset/Assets'
import { TextStyles } from '../../../engine/display/TextStyles'
import { GameStateID, GameStateManager } from '../../../manager/GameStateManager'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
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
            onTrigger: () => {
                GameStateManager.getInstance().enterState(GameStateID.WaveRunnerGame)
            }
        })
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const scaledWidth = this.backgroundWidth * UIDefaults.UIScale

        this.pos = {
            x: UIDefaults.UIEdgePadding,//GameWindow.width - UIDefaults.UIEdgePadding - scaledWidth ,
            y: GameWindow.fullWindowHeight
                - UIDefaults.UIEdgePadding
                - (this.backgroundHeight * UIDefaults.UIScale)
        }
    }

    
}
