import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'
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
        this.camera.cameraLetterboxPlugin.hide()
        this.camera.viewport.addChild(this.loadoutScreen)
        
        await super.initialize()
    }

    update() {
        this.loadoutScreen.update()
        this.inGameHUD.update()
    }
    
    async exit() {
        await this.loadoutScreen.hide()
        this.camera.viewport.removeChild(this.loadoutScreen)
        this.camera.viewport.removeChild(this.inGameHUD)
    }
}
