import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { IUIScreen, UIScreen } from '../UIScreen'
import { WaveRunnerHeader } from './WaveRunnerHeader'
import { IWaveRunnerScreenAnimator, WaveRunnerScreenAnimator } from './WaveRunnerScreenAnimator'

export interface IWaveRunnerScreen extends IUIScreen {

}

export class WaveRunnerScreen extends UIScreen implements IWaveRunnerScreen {
    header: WaveRunnerHeader
    animator: IWaveRunnerScreenAnimator

    constructor() {
        super({
            filters: []
        })

        this.header = new WaveRunnerHeader()
        this.animator = new WaveRunnerScreenAnimator({ screen: this })

        this.addChild(this.header)
        this.reposition(true)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const padding = UIDefaults.UIBleedPastBorderMargins.mid
        const headerX = GameWindow.width - this.header.width - padding
        const headerY = GameWindow.height - padding

        this.header.pos = { x: headerX, y: headerY }
    }
}
