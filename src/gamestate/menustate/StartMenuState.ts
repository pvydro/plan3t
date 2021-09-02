import { Game } from '../../main/Game'
import { CrosshairState } from '../../ui/ingamehud/crosshair/Crosshair'
import { StartScreen } from '../../ui/uiscreen/startscreen/StartScreen'
import { GameState, GameStateOptions, IGameState } from '../GameState'
import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'

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
        this.startScreen.update()
        this.inGameHUD.update()
    }
}
