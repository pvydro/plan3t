import { Sound } from '@pixi/sound'
import { GameStateID } from '../manager/GameStateManager'
import { IWaveRunnerManager, WaveRunnerManager } from '../manager/waverunnermanager/WaveRunnerManager'
import { SongKeyCodes } from '../musicplaylist/SongKeyCodes'
import { asyncTimeout } from '../utils/Utils'
import { IWave, Wave } from '../waverunner/Wave'
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

            this.musicManager.fetchSong(SongKeyCodes.Meiko).then((sound: Sound) => {
                sound.play()
            })
        })
    }

}
