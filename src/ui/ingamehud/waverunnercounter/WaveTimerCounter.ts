import { Graphix } from '../../../engine/display/Graphix'
import { importantLog } from '../../../service/Flogger'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { IWave } from '../../../waverunner/Wave'
import { IUIComponent, UIComponent } from '../../UIComponent'

export interface IWaveTimerCounter extends IUIComponent {
    setWave(wave: IWave): void
}

export class WaveTimerCounter extends UIComponent {
    currentWave?: IWave
    timerBar: Graphix
    endStopper: Graphix

    constructor() {
        super()
        
        this.timerBar = new Graphix()
        this.timerBar.beginFill(0xFFFFFF)
        this.timerBar.drawRect(0, 0, this.barWidth, 1)
        this.timerBar.endFill()
        this.timerBar.alpha = 0.25

        this.endStopper = new Graphix()
        this.endStopper.beginFill(0xFFFFFF)
        this.endStopper.drawRect(0, 0, 2, 1)
        this.endStopper.endFill()
        this.endStopper.alpha = 1

        this.addChild(this.timerBar)
        this.addChild(this.endStopper)
    }

    update() {
        const widthSnapBreakpoint = 0.1
        
        if (this.currentWave !== undefined) {
            this.timerBar.width = (this.barWidth * this.currentWave.currentTimePercentage)
        } else if (this.timerBar.width < this.barWidth - widthSnapBreakpoint) {
            this.timerBar.width += (this.barWidth - this.timerBar.width) / 10

            if (this.timerBar.width > this.barWidth - widthSnapBreakpoint) {
                this.timerBar.width = this.barWidth
            }
        }

        this.endStopper.x = this.timerBar.x + this.timerBar.width
    }

    setWave(wave: IWave) {
        importantLog('WaveTimerCounter', 'setWave')
        this.currentWave = wave
    }

    reposition() {
        this.timerBar.x = -UIDefaults.UIEdgePadding / UIDefaults.UIScale
        this.timerBar.y = this.timerBar.halfHeight
        this.endStopper.y = this.timerBar.y
    }

    get barWidth() {
        return GameWindow.fullWindowWidth / UIDefaults.UIScale
    }
}
