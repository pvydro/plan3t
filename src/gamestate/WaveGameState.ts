import { GameStateID } from '../manager/GameStateManager'
import { GameplayState } from './GameplayState'
import { GameStateOptions, IGameState } from './GameState'

export interface IWaveGameState extends IGameState {

}

export class WaveGameState extends GameplayState implements IWaveGameState {
    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.WaveGame
        })
    }


    async initialize() {
        super.initialize()

        // await WaveGameManager.initialize()
    }
}
