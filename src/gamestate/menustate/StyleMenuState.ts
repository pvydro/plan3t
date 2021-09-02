import { Game } from '../../main/Game'
import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'
import { CrosshairState } from '../../ui/ingamehud/crosshair/Crosshair'
import { GameState, GameStateOptions, IGameState } from '../GameState'

export interface IStyleMenuState extends IGameState {

}

export class StyleMenuState extends GameState implements IStyleMenuState {
    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.StyleMenu
        })
    }

    async initialize() {
        this.camera.cameraLetterboxPlugin.hide()
        
        await super.initialize()
    }
}
