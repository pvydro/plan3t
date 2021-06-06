import { Sound } from '@pixi/sound'
import { GameStateID } from '../manager/GameStateManager'
import { IWaveRunnerManager, WaveRunnerManager } from '../manager/waverunnermanager/WaveRunnerManager'
import { SongKeyCodes } from '../music/SongKeyCodes'
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

        this.waveManager = WaveRunnerManager.getInstance()
    }

    async initialize() {
        await super.initialize()
        
        asyncTimeout(500).then(() => {
            this.waveManager.initialize()
            
            this.musicManager.fetchSong(SongKeyCodes.Meiko).then((sound: Sound) => {
                sound.play()
            })
        })
    }

    update() {
        super.update()

        this.waveManager.update()
    }

}
