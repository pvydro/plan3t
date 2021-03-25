import { AssetUrls } from '../../../asset/Assets'
import { Fonts } from '../../../asset/Fonts'
import { TextSpriteAlign } from '../../../engine/display/TextSprite'
import { Flogger } from '../../../service/Flogger'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'
import { UIHoloButton } from '../../uibutton/UIHoloButton'

export interface IBeamMeUpButton extends IUIButton {

}

export class BeamMeUpButton extends UIHoloButton implements IBeamMeUpButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            anchor: {
                x: 0, y: 0
            },
            text: {
                text: 'Beam me down',
                uppercase: true,
                fontFamily: Fonts.Font.family,
                fontSize: 16,
                color: 0xFFFFFF,
            },
            // background: {
            //     idle: AssetUrls.HOLO_BUTTON_BG
            // },
            onTrigger: () => {

            }
        })
    }

    triggerBeamMeDown() {
        Flogger.log('BeamMeUpButton', 'beamMeDown')
    }
}
