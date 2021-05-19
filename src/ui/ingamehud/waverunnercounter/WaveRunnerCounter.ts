import { TextStyles } from '../../../engine/display/TextStyles'
import { Constants } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { IUIText, UIText } from '../../UIText'

export interface IWaveRunnerCounter extends IUIComponent {

}

export class WaveRunnerCounter extends UIComponent implements IWaveRunnerCounter {
    header: UIText
    waveLabel: UIText
    
    constructor() {
        super()

        this.header = new UIText({
            text: 'Waverunner',
            uppercase: true,
            style: TextStyles.Menu.HeaderSmall
        })
        this.waveLabel = new UIText({
            text: 'Wave 0',
            uppercase: true,
            style: TextStyles.Menu.HeaderSmallMd
        })

        this.addChild(this.header)
        this.addChild(this.waveLabel)

        this.forceHide()
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        this.position.set(UIDefaults.UIEdgePadding, -UIDefaults.UIBleedPastBorderMargins.mdMid)

        this.waveLabel.y = this.header.y - this.header.textHeight - (1 / UIDefaults.UIScale)
    }

    async show() {
        this.alpha = 1
    }

    async hide() {
        this.alpha = 0
    }
}
