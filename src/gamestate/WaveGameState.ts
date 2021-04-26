import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { GameStateID } from '../manager/GameStateManager'
import { IWaveRunnerManager, WaveRunnerManager } from '../manager/waverunnermanager/WaveRunnerManager'
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
        ClientPlayer.getInstance().pos = {
            x: 512,
            y: -256
        }

        this.waveManager = WaveRunnerManager.getInstance()
        await this.waveManager.initialize()
    }
}
