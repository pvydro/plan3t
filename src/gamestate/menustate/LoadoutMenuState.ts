import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'
import { camera } from '../../shared/Dependencies'
import { LoadoutScreen } from '../../ui/uiscreen/loadoutscreen/LoadoutScreen'
import { GameState, GameStateOptions } from '../GameState'

export interface IWeaponLoadoutState {

}

export class LoadoutMenuState extends GameState implements IWeaponLoadoutState {
    loadoutScreen: LoadoutScreen

    constructor(options: GameStateOptions) {
        super({
            id: GameStateID.LoadoutMenu,
            game: options.game
        })

    }

    async initialize() {
        this.loadoutScreen = new LoadoutScreen()
        camera.cameraLetterboxPlugin.hide()
        camera.viewport.addChild(this.loadoutScreen)
        
        await super.initialize()
    }

    update() {
        this.loadoutScreen.update()
        this.inGameHUD.update()
    }
    
    async exit() {
        await this.loadoutScreen.hide()
        camera.viewport.removeChild(this.loadoutScreen)
        camera.viewport.removeChild(this.inGameHUD)
    }
}
