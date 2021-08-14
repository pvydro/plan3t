import { AssetUrls } from '../../../asset/Assets'
import { TextSpriteAlign } from '../../../engine/display/TextSprite'
import { TextStyles } from '../../../engine/display/TextStyles'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface ISettingsButton extends IUIButton {

}

export class SettingsButton extends UIButton implements ISettingsButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            text: {
                text: 'Settings',
                uppercase: true,
                style: TextStyles.DefaultButton.Small,
                align: TextSpriteAlign.Left
            },
            background: {
                idle: AssetUrls.ButtonRectSmall,
                hovered: AssetUrls.ButtonRectSmallHovered
            },
            onHover: () => {
                console.log('hovered')
            },
            // darkenerOptions: {
            //     hoverTint: 0xdbdbdb,
            //     clickTint: 0x969696
            // },
            onTrigger: () => {
                // GameStateManager.getInstance().enterState(GameStateID.WaveRunnerGame)
            }
        })
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)
    }

    
}
