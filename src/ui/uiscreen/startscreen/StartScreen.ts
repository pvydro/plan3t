import { CRTFilter } from 'pixi-filters'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { UIHoloButton } from '../../uibutton/UIHoloButton'
import { RespawnButton } from '../respawnscreen/RespawnButton'
import { IUIScreen, UIScreen } from '../UIScreen'
import { PlayButton } from './PlayButton'
import { TitleLogo } from './TitleLogo'

export interface IStartScreen extends IUIScreen {
    
}

export class StartScreen extends UIScreen implements IStartScreen {
    playButton: PlayButton
    settingsButton: UIHoloButton//SettingsButton
    loadoutButton: UIHoloButton
    titleLogo: TitleLogo

    constructor() {
        super({
            filters: [
                new CRTFilter({
                    curvature: 5,
                    noise: 0.01,
                    lineWidth: 5,
                    lineContrast: 0.025,
                    vignetting: 0//0.175
                })
            ],
            background: { useSharedBackground: true }
        })

        this.playButton = new PlayButton()
        this.settingsButton = new UIHoloButton({
            text: { text: 'settings', }
        })
        this.loadoutButton = new UIHoloButton({
            text: { text: 'loadout' }
        })

        //new SettingsButton()
        this.titleLogo = new TitleLogo()

        this.addChild(this.playButton)
        this.addChild(this.settingsButton)
        this.addChild(this.loadoutButton)
        this.addChild(this.titleLogo)
        this.applyScale()
        this.reposition(true)
    }

    update() {
        super.update()

        this.playButton.update()
        this.settingsButton.update()
        this.loadoutButton.update()
    }

    applyScale() {
        const toScale = [
            this.playButton,
            this.settingsButton,
            this.loadoutButton,
            this.titleLogo
        ]
        
        super.applyScale(toScale)
    }
    
    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const scale = UIDefaults.UIScale
        const margin = UIDefaults.UIMargin * scale

        // this.playButton.reposition(false)
        this.playButton.x = GameWindow.halfWidth - (this.playButton.halfWidth * scale)
        this.playButton.y = GameWindow.fullWindowHeight
                - UIDefaults.UIEdgePadding - (this.playButton.height)

        this.titleLogo.x = GameWindow.halfWidth - this.titleLogo.halfWidth
        //GameWindow.fullWindowWidth - this.titleLogo.width - UIDefaults.UIEdgePadding
        this.titleLogo.y = UIDefaults.UIEdgePadding

        this.settingsButton.x = GameWindow.halfWidth - (this.settingsButton.halfWidth * scale)
        this.settingsButton.y = this.playButton.y - this.settingsButton.height - margin
    
        this.loadoutButton.x = GameWindow.halfWidth - (this.loadoutButton.halfWidth * scale)
        this.loadoutButton.y = this.settingsButton.y - this.loadoutButton.height - margin
    }
}
