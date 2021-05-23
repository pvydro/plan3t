
import { TextStyles } from '../../../engine/display/TextStyles'
import { Tween } from '../../../engine/display/tween/Tween'
import { Constants } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { IUIText, UIText } from '../../UIText'

export interface IWaveRunnerCounter extends IUIComponent {

}

export class WaveRunnerCounter extends UIComponent implements IWaveRunnerCounter {
    header: UIText
    // waveLabel: UIText
    waveNumberLabel: UIText
    
    constructor() {
        super()

        this.header = new UIText({
            text: 'Waverunner',
            uppercase: true,
            style: TextStyles.Menu.HeaderSmall
        })
        // this.waveLabel = new UIText({
        //     text: 'Wave',
        //     uppercase: true,
        //     style: TextStyles.Menu.HeaderSmallMd
        // })
        this.waveNumberLabel = new UIText({
            text: '0',
            style: TextStyles.WaveCounterNumber
        })

        this.addChild(this.header)
        // this.addChild(this.waveLabel)
        this.addChild(this.waveNumberLabel)

        this.forceHide()
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const oneScaled = (1 / UIDefaults.UIScale)

        this.position.set(UIDefaults.UIEdgePadding, -5)// -UIDefaults.UIBleedPastBorderMargins.mdMid)
        // this.waveLabel.y = this.header.y - this.header.textHeight - oneScaled

        // this.waveNumberLabel.x = this.waveLabel.x + this.waveLabel.textWidth
        // this.waveNumberLabel.y = this.waveLabel.y - this.waveNumberLabel.textHeight + this.waveLabel.height + (oneScaled * 4)

        this.waveNumberLabel.x = this.header.x - (oneScaled * 3)
        this.waveNumberLabel.y = this.header.y - (this.header.textHeight * 1.5) - oneScaled
    }

    setWaveValue(waveIndex: number) {
        this.waveNumberLabel.text = waveIndex.toString()
    }

    async show() {
        await Tween.to(this, {
            alpha: 1, duration: 0.5, autoplay: true
        })
    }

    async hide() {
        await Tween.to(this, {
            alpha: 0, duration: 0.5, autoplay: true
        })
    }
}