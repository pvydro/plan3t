import { GameStateID } from '../../../manager/gamestatemanager/GameStateManager'
import { gameStateMan } from '../../../shared/Dependencies'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { UIButton } from '../../uibutton/UIButton'
import { UIWoodButton } from '../../uibutton/UIWoodButton'
import { IUIScreen, UIScreen } from '../UIScreen'

export interface IWagerScreen extends IUIScreen {

}

export class WagerScreen extends UIScreen implements IWagerScreen {
    playButton: UIButton

    constructor() {
        super({
            filters: [],
            header: {
                text: 'Wager'
            },
            background: {
                useSharedBackground: true
            },
            addBackButton: true
        })

        const components = [
            this.playButton = new UIWoodButton({
                text: { text: 'Play' },
                onTrigger: () => {
                    gameStateMan.enterState(GameStateID.PVPGame)
                }
            })
        ]

        for (var i in components) {
            const component = components[i]
            this.addChild(component)
        }

        this.applyScale()
        this.reposition(true)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const scale = UIDefaults.UIScale
        const margin = UIDefaults.UIMargin * scale

        this.playButton.x = GameWindow.fullWindowWidth - this.playButton.width - margin
        this.playButton.y = GameWindow.fullWindowHeight - this.playButton.height - margin
    }

    applyScale() {
        const toScale = [
            this.playButton
        ]

        super.applyScale(toScale)
    }
}
