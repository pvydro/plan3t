import { Fonts } from '../../../asset/Fonts'
import { Flogger } from '../../../service/Flogger'
import { IUIButton, UIButtonType } from '../../uibutton/UIButton'
import { UIHoloButton } from '../../uibutton/UIHoloButton'

export interface IBeamMeUpButton extends IUIButton {

}

export class BeamMeUpButton extends UIHoloButton implements IBeamMeUpButton {
    constructor() {
        super({
            type: UIButtonType.Tap,
            text: {
                text: 'Beam me down',
                fontFamily: Fonts.Font.family,
            },
            onTrigger: () => {

            }
        })
    }

    triggerBeamMeDown() {
        Flogger.log('BeamMeUpButton', 'beamMeDown')
    }
}
