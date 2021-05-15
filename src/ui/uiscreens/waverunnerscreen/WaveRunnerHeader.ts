import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'

export interface IWaveRunnerHeader extends IUIComponent {

}

export class WaveRunnerHeader extends UIComponent implements IWaveRunnerHeader {
    constructor() {
        super()

        const waveRunnerText = new UIText({
            text: 'WaveRunner'
        })

        this.addChild(waveRunnerText)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
    }
}
