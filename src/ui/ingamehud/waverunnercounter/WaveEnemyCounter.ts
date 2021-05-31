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
}
