import { GameStateID } from '../../manager/gamestatemanager/GameStateManager'
import { camera } from '../../shared/Dependencies'
import { WaveRunnerMenuScreen } from '../../ui/uiscreen/waverunnermenuscreen/WaveRunnerMenuScreen'
import { GameState, GameStateOptions, IGameState } from '../GameState'

export interface IWaveRunnerMenuState extends IGameState {
}

export class WaveRunnerMenuState extends GameState implements IWaveRunnerMenuState {
    screen: WaveRunnerMenuScreen

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.WaveRunnerMenu
        })
    }

    async initialize() {
        this.screen = new WaveRunnerMenuScreen()

        camera.cameraLetterboxPlugin.hide()
        camera.viewport.addChild(this.screen)

        await super.initialize()
    }

    update() {
        this.screen.update()
    }

    async exit() {
        await this.screen.hide()
        camera.viewport.removeChild(this.screen)
    }
}
