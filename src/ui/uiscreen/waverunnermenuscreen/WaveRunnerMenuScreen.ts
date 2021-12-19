import { CRTFilter } from 'pixi-filters'
import { GameStateID } from '../../../manager/gamestatemanager/GameStateManager'
import { gameStateMan } from '../../../shared/Dependencies'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { UIButton } from '../../uibutton/UIButton'
import { UIWoodButton } from '../../uibutton/UIWoodButton'
import { IUIScreen, UIScreen } from '../UIScreen'

export interface IWaveRunnerMenuScreen extends IUIScreen {

}

export class WaveRunnerMenuScreen extends UIScreen implements IWaveRunnerMenuScreen {
    buttons: UIButton[]

    constructor() {
        super({
            filters: [
                new CRTFilter({
                    curvature: 5,
                    noise: 0.01,
                    lineWidth: 5,
                    lineContrast: 0.025,
                    vignetting: 0
                })
            ],
            background: {
                useSharedBackground: true,
            },
            header: {
                text: 'WaveRunner'
            },
            addBackButton: true
        })

        this.buttons = [
            new UIWoodButton({
                text: { text: 'join' },
                inputOptions: {
                    showOnClick: true
                }
            }),
            new UIWoodButton({
                text: { text: 'create' },
                onTrigger: () => {
                    gameStateMan.enterState(GameStateID.Gameplay)//GameStateID.WaveRunnerGame)
                }
            }),
        ]

        this.addChild(...this.buttons)

        this.applyScale()
        this.reposition(true)
    }

    applyScale() {
        const toScale = [
            ...this.buttons
        ]

        super.applyScale(toScale)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
        const margin = UIDefaults.UIMargin * UIDefaults.UIScale
        const bottomY = GameWindow.fullWindowHeight - margin
        const buttonMargin = 1 * UIDefaults.UIScale

        this.buttons.forEach((button, index) => {
            button.x = GameWindow.fullWindowWidth - margin - button.width
            button.y = bottomY - ((button.height + buttonMargin) * (index + 1))
        })
    }
}
