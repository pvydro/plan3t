import { Game } from '../main/Game'
import { GameStateID } from '../manager/GameStateManager'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { StartScreen } from '../ui/uiscreen/startscreen/StartScreen'
import { Defaults } from '../utils/Defaults'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface IStartMenuState extends IGameState {

}

export class StartMenuState extends GameState {
    startScreen: StartScreen

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.StartMenu
        })
    }

    async initialize() {
        this.startScreen = new StartScreen()
        this.camera.cameraLetterboxPlugin.hide()
        // this.inGameHUD.show()
        this.inGameHUD.requestCrosshairState(CrosshairState.Cursor)
        this.inGameHUD.crosshair.show()

        this.camera.viewport.addChild(this.startScreen)
        this.camera.viewport.addChild(this.inGameHUD.crosshair)

        await Game.showLoadingScreen(false)
    }

    async exit() {
        await this.startScreen.hide()
        this.camera.viewport.removeChild(this.startScreen)
        this.camera.viewport.removeChild(this.inGameHUD)
    }

    update() {
        this.inGameHUD.update()
    }
}
