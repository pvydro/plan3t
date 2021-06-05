import { IUIScreen, UIScreen } from '../UIScreen'
import { PlayButton } from './PlayButton'

export interface IStartScreen extends IUIScreen {
    
}

export class StartScreen extends UIScreen implements IStartScreen {
    playButton: PlayButton

    constructor() {
        super({ filters: [] })

        this.playButton = new PlayButton()

        this.addChild(this.playButton)
        this.applyScale()
        this.reposition(true)
    }

    applyScale() {
        const toScale = [
            this.playButton
        ]
        
        super.applyScale(toScale)
    }
    
    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        this.playButton.reposition(false)
    }
}
