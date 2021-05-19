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
    waveNumberLabel: UIText
    
    constructor() {
        super()

        this.header = new UIText({
            text: 'Waverunner',
            uppercase: true,
            style: TextStyles.Menu.HeaderSmall
        })
        this.waveLabel = new UIText({
            text: 'Wave',
            uppercase: true,
            style: TextStyles.Menu.HeaderSmallMd
        })
        this.waveNumberLabel = new UIText({
            text: '0',
            style: TextStyles.WaveCounterNumber
        })

        this.addChild(this.header)
        this.addChild(this.waveLabel)
        this.addChild(this.waveNumberLabel)

        this.forceHide()
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const oneScaled = (1 / UIDefaults.UIScale)

        this.position.set(UIDefaults.UIEdgePadding, -UIDefaults.UIBleedPastBorderMargins.mdMid)
        this.waveLabel.y = this.header.y - this.header.textHeight - oneScaled

        this.waveNumberLabel.x = this.waveLabel.x + this.waveLabel.textWidth
        this.waveNumberLabel.y = this.waveLabel.y - this.waveNumberLabel.textHeight + this.waveLabel.height + (oneScaled * 4)
    }

    async show() {
        this.alpha = 1
    }

    async hide() {
        this.alpha = 0
    }
}
