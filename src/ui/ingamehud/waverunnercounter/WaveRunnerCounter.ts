import { TextStyles } from '../../../engine/display/TextStyles'
import { UIDefaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { IUIText, UIText } from '../../UIText'

export interface IWaveRunnerCounter extends IUIComponent {

}

export class WaveRunnerCounter extends UIComponent implements IWaveRunnerCounter {
    header: UIText
    
    constructor() {
        super()

        this.header = new UIText({
            text: 'Waverunner',
            uppercase: true,
            style: TextStyles.Menu.HeaderSmall
        })

        this.addChild(this.header)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        this.position.set(UIDefaults.UIEdgePadding, -UIDefaults.UIBleedPastBorderMargins.mdMid)
    }

    async show() {
        this.alpha = 1
    }

    async hide() {
        this.alpha = 0
    }
}
