import { Graphix } from '../../../engine/display/Graphix'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'

export interface IWaveTimerCounter extends IUIComponent {

}

export class WaveTimerCounter extends UIComponent {
    timerBar: Graphix

    constructor() {
        super()

        const barHeight = 1
        const windowWidth = GameWindow.width / UIDefaults.UIScale

        this.timerBar = new Graphix()
        this.timerBar.beginFill(0xFFFFFF)
        this.timerBar.drawRect(0, 0, windowWidth, barHeight)
        this.timerBar.endFill()

        this.addChild(this.timerBar)
    }

    update() {
        
    }

    reposition() {
        this.timerBar.x = -UIDefaults.UIEdgePadding / UIDefaults.UIScale
        this.timerBar.y = this.timerBar.halfHeight
    }
}
