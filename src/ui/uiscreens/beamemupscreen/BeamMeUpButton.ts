import { AssetUrls } from '../../../asset/Assets'
import { Fonts } from '../../../asset/Fonts'
import { Flogger } from '../../../service/Flogger'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IBeamMeUpButton extends IUIButton {

}

export class BeamMeUpButton extends UIButton implements IBeamMeUpButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            anchor: {
                x: 0, y: 0
            },
            text: {
                text: 'Beam me down',
                uppercase: true,
                style: {
                    fontFamily: Fonts.FontDefault.family,
                    fontSize: 16,
                    color: 0xFFFFFF,
                }
            },
            background: {
                idle: AssetUrls.MID_BUTTON_METAL
            },
            darkenerPluginOptions: {
                hoverTint: 0xdbdbdb,
                clickTint: 0x969696
            },
            onTrigger: () => {}
        })
    }

    triggerBeamMeDown() {
        Flogger.log('BeamMeUpButton', 'beamMeDown')
    }
}
