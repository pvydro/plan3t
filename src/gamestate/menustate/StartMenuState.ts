import { StartScreen } from '../../ui/uiscreen/startscreen/StartScreen'
import { GameState, GameStateOptions, IGameState } from '../GameState'
import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'

export interface IStartMenuState extends IGameState {

}

export class StartMenuState extends GameState implements IStartMenuState {
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
        
        await super.initialize()
    }

    update() {
        this.startScreen.update()
        this.inGameHUD.update()
    }

    async exit() {
        await this.startScreen.hide()
        this.startScreen.exit()
        this.camera.viewport.removeChild(this.startScreen)
        this.camera.viewport.removeChild(this.inGameHUD)
    }
}
