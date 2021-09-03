import { Sound } from '@pixi/sound'
import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../input/InputProcessor'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { IWaveRunnerManager, WaveRunnerManager } from '../manager/waverunnermanager/WaveRunnerManager'
import { SongKeyCodes } from '../music/SongKeyCodes'
import { ChatService } from '../service/chatservice/ChatService'
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

            ChatService.fetchChatHistoryFromRoom()
        })

        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which === Key.X) {
                ChatService.sendMessage({
                    sender: 'test',
                    text: 'test message'
                })
            }
        })
    }

    update() {
        super.update()
        this.waveManager.update()
    }

}
