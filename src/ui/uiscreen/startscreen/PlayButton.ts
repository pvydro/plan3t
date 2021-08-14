import { AssetUrls } from '../../../asset/Assets'
import { TextSpriteAlign } from '../../../engine/display/TextSprite'
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
                style: TextStyles.DefaultButton.Medium,
                align: TextSpriteAlign.Left
            },
            background: {
                idle: AssetUrls.ButtonRectDefault,
                hovered: AssetUrls.ButtonRectDefaultHovered
            },
            onHover: () => {
                console.log('hovered')
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
