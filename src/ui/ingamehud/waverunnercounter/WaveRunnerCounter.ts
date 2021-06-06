
import { TextStyles } from '../../../engine/display/TextStyles'
import { Tween } from '../../../engine/display/tween/Tween'
import { UIDefaults } from '../../../utils/Defaults'
import { asyncTimeout } from '../../../utils/Utils'
import { IWave } from '../../../waverunner/Wave'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'
import { WaveEnemyCounter } from './WaveEnemyCounter'
import { WaveTimerCounter } from './WaveTimerCounter'

export interface IWaveRunnerCounter extends IUIComponent {

}

export class WaveRunnerCounter extends UIComponent implements IWaveRunnerCounter {
    _shouldShowEnemyCounter: boolean = false
    header: UIText
    waveNumberLabel: UIText
    enemyCounter: WaveEnemyCounter
    timerCounter: WaveTimerCounter
    
    constructor() {
        super()

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
        this.timerCounter = new WaveTimerCounter()

        this.addChild(this.header)
        this.addChild(this.waveNumberLabel)
        this.addChild(this.enemyCounter)
        this.addChild(this.timerCounter)

        this.forceHide()
    }

    update() {
        this.timerCounter.update()
    }

    setWaveValue(wave: IWave) {
        asyncTimeout(500).then(() => {
            this.timerCounter.setWave(wave)
            this.waveNumberLabel.setText(wave.waveIndex.toString())
            this.enemyCounter.setTotalEnemies(wave.totalEnemies)
            this._shouldShowEnemyCounter = true
        })
    }

    async show() {
        if (this._shouldShowEnemyCounter) {
            this.enemyCounter.showFor(2000, { delay: 500 })
            this._shouldShowEnemyCounter = false
        }

        await Tween.to(this, { alpha: 1, duration: 0.5, autoplay: true })
    }

    async hide() {
        await Tween.to(this, { alpha: 0, duration: 0.5, autoplay: true })
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
        const margin = (1 / UIDefaults.UIScale)

        this.position.set(UIDefaults.UIEdgePadding, -5)
        
        this.waveNumberLabel.x = this.header.x - (margin * 3)
        this.waveNumberLabel.y = this.header.y - (this.header.textHeight * 1.5) - margin
        this.enemyCounter.y = this.header.y + this.header.textHeight - this.enemyCounter.enemiesText.halfTextHeight + margin

        this.timerCounter.reposition()
    }
}
