import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'
import { WagerScreen } from '../../ui/uiscreen/wagerscreen/WagerScreen'
import { GameState, GameStateOptions } from '../GameState'

export interface IWagerMenuState {

}

export class WagerMenuState extends GameState implements IWagerMenuState {
    screen: WagerScreen

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.WagerMenu
        })
    }

    async initialize() {
        this.screen = new WagerScreen()
        this.camera.viewport.addChild(this.screen)

        await super.initialize()
    }

    update() {
        this.screen.update()
        this.inGameHUD.update()
    }

    async exit() {
        await this.screen.hide()
        this.screen.exit()
        this.camera.viewport.removeChild(this.screen)
    }
}
