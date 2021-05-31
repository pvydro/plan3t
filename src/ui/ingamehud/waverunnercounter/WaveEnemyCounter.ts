import { TextStyles } from '../../../engine/display/TextStyles'
import { Tween } from '../../../engine/display/tween/Tween'
import { ShowOptions } from '../../../interface/IShowHide'
import { asyncTimeout } from '../../../utils/Utils'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { IUIText, UIText } from '../../UIText'

export interface IWaveEnemyCounter extends IUIComponent {
    enemiesText: IUIText
}

export class WaveEnemyCounter extends UIComponent implements IWaveEnemyCounter {
    enemiesPrefix: string = 'Enemies: '
    enemiesText: UIText

    constructor() {
        super()

        this.enemiesText = new UIText({
            text: this.enemiesPrefix,
            uppercase: true,
            style: TextStyles.Menu.HeaderSmaller
        })

        this.addChild(this.enemiesText)
        this.forceHide()
    }

    setTotalEnemies(totalEnemies: number) {
        this.enemiesText.setText(this.enemiesPrefix + totalEnemies)
    }

    async show(options?: ShowOptions) {
        if (options && options.delay) {
            await asyncTimeout(options.delay)
        }

        await Tween.to(this, {
            alpha: 1, duration: 0.5, autoplay: true
        })

        super.show()
    }

    async hide() {
        await Tween.to(this, {
            alpha: 0, duration: 0.5, autoplay: true
        })

        super.hide()
    }
}
