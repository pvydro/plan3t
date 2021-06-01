import { IUIScreen, UIScreen } from '../UIScreen'
import { PlayButton } from './PlayButton'

export interface IStartScreen extends IUIScreen {
    
}

export class StartScreen extends UIScreen implements IStartScreen {
    playButton: PlayButton

    constructor() {
        super()

        this.playButton = new PlayButton()

        this.addChild(this.playButton)
    }
}
