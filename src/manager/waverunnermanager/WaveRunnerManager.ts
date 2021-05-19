import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { importantLog, log } from '../../service/Flogger'
import { IInGameHUD, InGameHUD } from '../../ui/ingamehud/InGameHUD'
import { IWave, Wave } from '../../waverunner/Wave'
import { IWaveRunnerGame, WaveRunnerGame } from '../../waverunner/WaveRunnerGame'

export interface IWaveRunnerManager {
    initialize(): Promise<void>
}

export class WaveRunnerManager implements IWaveRunnerManager {
    private static Instance: IWaveRunnerManager
    currentWaveRunnerGame: IWaveRunnerGame
    currentWaveIndex: number = 0
    hud: IInGameHUD

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new WaveRunnerManager()
        }

        return this.Instance
    }

    private constructor() {
        this.hud = InGameHUD.getInstance()

        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which === Key.Y) {
                this.registerNextWave()
            }
        })
    }

    async initialize() {
        importantLog('WaveRunnerManager', 'initialize')

        this.currentWaveRunnerGame = new WaveRunnerGame()
        this.currentWaveRunnerGame.beginWaveRunner()
    }

    registerNextWave(): IWave {
        log('WaveRunnerManager', 'registerNextWave', 'prevWave', this.currentWaveIndex)

        this.currentWaveIndex++
        
        const wave = new Wave({
            onSpawn: () => {
                this.currentWaveRunnerGame.spawner.spawn()
            }
        })
        
        this.hud.waveRunnerCounter.setWaveValue(this.currentWaveIndex)
        this.hud.loadWave(this.currentWave)
        this.currentWaveRunnerGame.loadWave(wave)

        return wave
    }

    get currentWave() {
        return this.currentWaveRunnerGame.currentWave
    }
}
