import { CRTFilter } from 'pixi-filters'
import { Container } from '../../../engine/display/Container'
import { GameStateID } from '../../../manager/gamestatemanager/GameStateManager'
import { gameStateMan } from '../../../shared/Dependencies'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { UIButton } from '../../uibutton/UIButton'
import { UIWoodButton } from '../../uibutton/UIWoodButton'
import { IUIScreen, UIScreen } from '../UIScreen'
import { TitleLogo } from './TitleLogo'
import { VersionInfoComponent } from './VersionInfoComponent'

export interface IStartScreen extends IUIScreen {
    
}

export class StartScreen extends UIScreen implements IStartScreen {
    wagerButton: UIButton
    waveRunnerButton: UIButton
    settingsButton: UIButton
    styleButton: UIButton
    loadoutButton: UIButton
    titleLogo: TitleLogo
    buttonContainer: Container
    buttons: UIButton[]
    versionInfo: VersionInfoComponent

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
                useSharedBackground: true
            },
            shakeOptions: {
                shouldShake: true
            }
        })

        this.titleLogo = new TitleLogo()
        this.versionInfo = new VersionInfoComponent()
        this.buttonContainer = new Container()
        this.buttons = [
            this.wagerButton = new UIWoodButton({
                text: { text: 'wager' },
                onTrigger: () => {
                    gameStateMan.enterState(GameStateID.WagerMenu)
                }
            }),
            this.waveRunnerButton = new UIWoodButton({
                text: { text: 'waverunner' },
                onTrigger: () => {
                    gameStateMan.enterState(GameStateID.WaveRunnerMenu)
                }
            }),
            this.settingsButton = new UIWoodButton({
                text: { text: 'settings' }
            }),
            this.styleButton = new UIWoodButton({
                text: { text: 'style' },
                onTrigger: () => {
                    gameStateMan.enterState(GameStateID.StyleMenu)
                }
            }),
            this.loadoutButton = new UIWoodButton({
                text: { text: 'loadout' },
                onTrigger: () => {
                    gameStateMan.enterState(GameStateID.LoadoutMenu)
                }
            })
        ]
        
        this.buttonContainer.addChild(...this.buttons)
        this.addChild(this.titleLogo)
        this.addChild(this.versionInfo)
        this.addChild(this.buttonContainer)
        this.applyScale()
        this.reposition(true)
    }

    update() {
        super.update()

        this.waveRunnerButton.update()
        this.settingsButton.update()
        this.loadoutButton.update()
    }

    applyScale() {
        const toScale = [
            ...this.buttons,
            this.titleLogo,
            this.versionInfo
        ]
        
        super.applyScale(toScale)
    }
    
    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        const scale = UIDefaults.UIScale
        const margin = UIDefaults.UIMargin * scale
        const buttonMargin = 1 * scale
        let lastButtonProperties = { height: 0, y: 0 }

        for (let i in this.buttons) {
            const btn = this.buttons[i]

            btn.position.x = -btn.halfWidth * scale
            btn.position.y = lastButtonProperties.y + lastButtonProperties.height + buttonMargin

            lastButtonProperties.height = btn.height
            lastButtonProperties.y = btn.y
        }

        this.buttonContainer.pos = { x: GameWindow.halfWidth, y: GameWindow.halfHeight }
        this.titleLogo.pos = {
            x: GameWindow.halfWidth - this.titleLogo.halfWidth,
            y: this.buttonContainer.y - this.titleLogo.height - buttonMargin
        }
        this.versionInfo.pos = {
            x: margin,
            y: GameWindow.fullWindowHeight - margin - this.versionInfo.height
        }
    }
}
