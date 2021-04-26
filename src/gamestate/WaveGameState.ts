import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { GameStateID } from '../manager/GameStateManager'
import { IWaveRunnerManager, WaveRunnerManager } from '../manager/waverunnermanager/WaveRunnerManager'
import { asyncTimeout } from '../utils/Utils'
import { GameplayState } from './GameplayState'
import { GameStateOptions, IGameState } from './GameState'

export interface IWaveGameState extends IGameState {

}

export class WaveGameState extends GameplayState implements IWaveGameState {
    waveManager: IWaveRunnerManager
    
    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.WaveRunnerGame
        })

    }

    async initialize() {
        await super.initialize()

        asyncTimeout(500).then(() => {
            this.waveManager = WaveRunnerManager.getInstance()
            this.waveManager.initialize()
        })
    }
}
