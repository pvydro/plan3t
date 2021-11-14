import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'
import { camera, inGameHUD } from '../../shared/Dependencies'
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

        camera.cameraLetterboxPlugin.hide()
        camera.viewport.addChild(this.styleScreen)
        
        await super.initialize()
    }

    update() {
        this.styleScreen.update()
    }
    
    async exit() {
        await this.styleScreen.hide()
        camera.viewport.removeChild(this.styleScreen)
        // camera.viewport.removeChild(inGameHUD)
    }
}
