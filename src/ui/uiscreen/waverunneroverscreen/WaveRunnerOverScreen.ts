import { UIDefaults } from '../../../utils/Defaults'
import { IUIScreen, UIScreen } from '../UIScreen'
import { WaveRunnerHeader } from '../waverunnerscreen/WaveRunnerHeader'

export interface IWaveRunnerOverScreen extends IUIScreen {

}

export class WaveRunnerOverScreen extends UIScreen implements IWaveRunnerOverScreen {
    header: WaveRunnerHeader

    constructor() {
        super({
            filters: []
        })

        this.header = new WaveRunnerHeader()

        this.addChild(this.header)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const padding = UIDefaults.UIBleedPastBorderMargins.mdLarge

        this.header.pos = { x: 0, y: 0 }
    }
}
