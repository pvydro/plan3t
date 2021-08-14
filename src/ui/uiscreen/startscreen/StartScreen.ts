import { RespawnButton } from '../respawnscreen/RespawnButton'
import { IUIScreen, UIScreen } from '../UIScreen'
import { PlayButton } from './PlayButton'

export interface IStartScreen extends IUIScreen {
    
}

export class StartScreen extends UIScreen implements IStartScreen {
    playButton: PlayButton
    tmpRespawnButton: RespawnButton

    constructor() {
        super({
            filters: [],
            background: { useSharedBackground: true }
        })

        this.playButton = new PlayButton()
        this.tmpRespawnButton = new RespawnButton()

        this.addChild(this.playButton)
        this.addChild(this.tmpRespawnButton)
        this.applyScale()
        this.reposition(true)
    }

    update() {
        this.playButton.update()
        this.tmpRespawnButton.update()
    }

    applyScale() {
        const toScale = [
            this.playButton,
            this.tmpRespawnButton
        ]
        
        super.applyScale(toScale)
    }
    
    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        this.playButton.reposition(false)
        this.tmpRespawnButton.reposition(false)
    }
}
