import { CRTFilter } from 'pixi-filters'
import { Container } from '../../../engine/display/Container'
import { GameStateID, GameStateManager } from '../../../manager/gamestatemanager/GameStateManager'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { UIButton } from '../../uibutton/UIButton'
import { UIWoodButton } from '../../uibutton/UIWoodButton'
import { IUIScreen, UIScreen } from '../UIScreen'
import { TitleLogo } from './TitleLogo'

export interface IStartScreen extends IUIScreen {
    
}

export class StartScreen extends UIScreen implements IStartScreen {
    playButton: UIButton//PlayButton
    settingsButton: UIButton
    styleButton: UIButton
    loadoutButton: UIButton
    titleLogo: TitleLogo
    buttonContainer: Container
    buttons: UIButton[]

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
            background: {
                useSharedBackground: true
            }
        })

        this.titleLogo = new TitleLogo()
        this.buttonContainer = new Container()
        this.buttons = [
            this.playButton = new UIWoodButton({
                text: { text: 'play' },
                // scale: 1.5
                // onTrigger: () => {
                //     GameStateManager.getInstance().enterState(GameStateID.WaveRunnerGame)
                // }
            }),
            this.settingsButton = new UIWoodButton({
                text: { text: 'settings' }
            }),
            this.styleButton = new UIWoodButton({
                text: { text: 'style' },
                onTrigger: () => {
                    GameStateManager.getInstance().enterState(GameStateID.StyleMenu)
                }
            }),
            this.loadoutButton = new UIWoodButton({
                text: { text: 'loadout' },
                onTrigger: () => {
                    GameStateManager.getInstance().enterState(GameStateID.LoadoutMenu)
                }
            })
        ]

        for (var i in this.buttons) {
            const btn = this.buttons[i]
            this.buttonContainer.addChild(btn)
        }
        this.addChild(this.titleLogo)
        this.addChild(this.buttonContainer)
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
            this.titleLogo
        ]
        for (const i in this.buttons) {
            toScale.push(this.buttons[i])
        }
        
        super.applyScale(toScale)
    }
    
    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const scale = UIDefaults.UIScale
        const margin = 1 * scale//UIDefaults.UIMargin * scale
        let lastButtonProperties = { height: 0, y: 0 }

        for (let i in this.buttons) {
            const btn = this.buttons[i]

            btn.position.x = -btn.halfWidth * scale
            btn.position.y = lastButtonProperties.y + lastButtonProperties.height + margin

            lastButtonProperties.height = btn.height
            lastButtonProperties.y = btn.y
        }

        this.buttonContainer.pos = {
            x: GameWindow.halfWidth,
            y: GameWindow.halfHeight
        }
        this.titleLogo.pos = {
            x: GameWindow.halfWidth - this.titleLogo.halfWidth,
            y: this.buttonContainer.y - this.titleLogo.height - margin
        }
    }
}
