import { GameStateID } from '../manager/gamestatemanager/GameStateManager';
import { GameplayState } from './GameplayState';
import { GameStateOptions, IGameState } from './GameState'

export interface IPVPGameState extends IGameState {

}

export class PVPGameState extends GameplayState implements IPVPGameState {
    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.PVPGame
        })
    }

    async initialize() {
        await super.initialize()
    }

    gameOver() {
        super.gameOver()

        // InGameHUD.getInstance().requestMenuScreen(InGameScreenID.WaveRunnerOver)
    }
}
