import { Game } from '../main/Game'
import { GameStateID } from '../manager/GameStateManager'
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
        this.camera.viewport.addChild(this.startScreen)

        await Game.showLoadingScreen(false)
    }
}
