import { CRTFilter } from 'pixi-filters'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { UIHoloButton } from '../../uibutton/UIHoloButton'
import { RespawnButton } from '../respawnscreen/RespawnButton'
import { IUIScreen, UIScreen } from '../UIScreen'
import { PlayButton } from './PlayButton'
import { SettingsButton } from './SettingsButton'
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

        const margin = UIDefaults.UIMargin * UIDefaults.UIScale

        this.playButton.reposition(false)

        this.titleLogo.x = GameWindow.fullWindowWidth - this.titleLogo.width - UIDefaults.UIEdgePadding
        this.titleLogo.y = UIDefaults.UIEdgePadding

        this.settingsButton.x = this.playButton.x
        this.settingsButton.y = this.playButton.y - this.settingsButton.height - margin
    
        this.loadoutButton.x = this.playButton.x
        this.loadoutButton.y = this.settingsButton.y - this.loadoutButton.height - margin
    }
}
