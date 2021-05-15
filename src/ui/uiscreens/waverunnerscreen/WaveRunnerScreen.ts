import { IUIScreen, UIScreen } from '../UIScreen'
import { WaveRunnerHeader } from './WaveRunnerHeader'
import { IWaveRunnerScreenAnimator, WaveRunnerScreenAnimator } from './WaveRunnerScreenAnimator'

export interface IWaveRunnerScreen extends IUIScreen {

}

export class WaveRunnerScreen extends UIScreen implements IWaveRunnerScreen {
    header: WaveRunnerHeader
    animator: IWaveRunnerScreenAnimator

    constructor() {
        super()

        this.header = new WaveRunnerHeader()

        this.addChild(this.header)

        this.animator = new WaveRunnerScreenAnimator({ screen: this })
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        
    }
}
