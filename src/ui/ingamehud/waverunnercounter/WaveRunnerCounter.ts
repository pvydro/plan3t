
import { TextStyles } from '../../../engine/display/TextStyles'
import { Tween } from '../../../engine/display/tween/Tween'
import { UIDefaults } from '../../../utils/Defaults'
import { IWave } from '../../../waverunner/Wave'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'
import { WaveEnemyCounter } from './WaveEnemyCounter'

export interface IWaveRunnerCounter extends IUIComponent {

}

export class WaveRunnerCounter extends UIComponent implements IWaveRunnerCounter {
    // waveLabel: UIText
    _shouldShowEnemyCounter: boolean = false
    header: UIText
    waveNumberLabel: UIText
    enemyCounter: WaveEnemyCounter
    
    constructor() {
        super()

        // this.waveLabel = new UIText({
        //     text: 'Wave',
        //     uppercase: true,
        //     style: TextStyles.Menu.HeaderSmallMd
        // })
        this.header = new UIText({
            text: 'Waverunner',
            uppercase: true,
            style: TextStyles.Menu.HeaderSmall
        })
        this.waveNumberLabel = new UIText({
            text: '0',
            style: TextStyles.WaveCounterNumber
        })
        this.enemyCounter = new WaveEnemyCounter()

        this.addChild(this.header)
        this.addChild(this.waveNumberLabel)
        this.addChild(this.enemyCounter)
        // this.addChild(this.waveLabel)

        this.forceHide()
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const margin = (1 / UIDefaults.UIScale)

        // this.waveLabel.y = this.header.y - this.header.textHeight - oneScaled
        // this.waveNumberLabel.x = this.waveLabel.x + this.waveLabel.textWidth
        // this.waveNumberLabel.y = this.waveLabel.y - this.waveNumberLabel.textHeight + this.waveLabel.height + (oneScaled * 4)
        this.position.set(UIDefaults.UIEdgePadding, -5)
        
        this.waveNumberLabel.x = this.header.x - (margin * 3)
        this.waveNumberLabel.y = this.header.y - (this.header.textHeight * 1.5) - margin
        this.enemyCounter.y = this.header.y + this.header.halfTextHeight + margin
    }

    setWaveValue(wave: IWave) {
        this.waveNumberLabel.setText(wave.waveIndex.toString())
        this.enemyCounter.setTotalEnemies(wave.totalEnemies)
        this._shouldShowEnemyCounter = true
    }

    async show() {
        if (this._shouldShowEnemyCounter) {
            this.enemyCounter.showFor(2000, { delay: 500 })
            this._shouldShowEnemyCounter = false
        }

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
