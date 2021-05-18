import { Fonts } from '../../../asset/Fonts'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'

export interface IWaveRunnerHeader extends IUIComponent {

}

export class WaveRunnerHeader extends UIComponent implements IWaveRunnerHeader {
    constructor() {
        super()

        const waveRunnerText = new UIText({
            text: 'WaveRunner',
            uppercase: true,
            style: {
                fontFamily: Fonts.FontDefault.family
            }
        })

        this.addChild(waveRunnerText)
    }
}
