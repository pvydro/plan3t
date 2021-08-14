import { CRTFilter } from 'pixi-filters'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { RespawnButton } from '../respawnscreen/RespawnButton'
import { IUIScreen, UIScreen } from '../UIScreen'
import { PlayButton } from './PlayButton'
import { TitleLogo } from './TitleLogo'

export interface IStartScreen extends IUIScreen {
    
}

export class StartScreen extends UIScreen implements IStartScreen {
    playButton: PlayButton
    titleLogo: TitleLogo

    constructor() {
        super({
            filters: [
                new CRTFilter({
                    curvature: 5,
                    noise: 0.01,
                    lineWidth: 5,
                    lineContrast: 0.025,
                    vignetting: 0.175
                })
            ],
            background: { useSharedBackground: true }
        })

        this.playButton = new PlayButton()
        this.titleLogo = new TitleLogo()

        this.addChild(this.playButton)
        this.addChild(this.titleLogo)
        this.applyScale()
        this.reposition(true)
    }

    update() {
        this.playButton.update()
    }

    applyScale() {
        const toScale = [
            this.playButton,
            this.titleLogo
        ]
        
        super.applyScale(toScale)
    }
    
    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        this.playButton.reposition(false)

        this.titleLogo.x = GameWindow.width - this.titleLogo.width - UIDefaults.UIEdgePadding
        this.titleLogo.y = UIDefaults.UIEdgePadding
    }
}
