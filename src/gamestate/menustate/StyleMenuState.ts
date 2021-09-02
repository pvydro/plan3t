import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'
import { StyleScreen } from '../../ui/uiscreen/stylescreen/StyleScreen'
import { GameState, GameStateOptions, IGameState } from '../GameState'

export interface IStyleMenuState extends IGameState {

}

export class StyleMenuState extends GameState implements IStyleMenuState {
    styleScreen: StyleScreen

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.StyleMenu
        })
    }

    async initialize() {
        this.styleScreen = new StyleScreen()

        this.camera.cameraLetterboxPlugin.hide()
        this.camera.viewport.addChild(this.styleScreen)
        
        await super.initialize()
    }

    update() {
        this.styleScreen.update()
        this.inGameHUD.update()
    }
    
    async exit() {
        await this.styleScreen.hide()
        this.camera.viewport.removeChild(this.styleScreen)
        this.camera.viewport.removeChild(this.inGameHUD)
    }
}
