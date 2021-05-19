import { importantLog } from '../../service/Flogger'
import { IWave, Wave } from '../../waverunner/Wave'
import { IWaveRunnerGame, WaveRunnerGame } from '../../waverunner/WaveRunnerGame'

export interface IWaveRunnerManager {
    initialize(): Promise<void>
}

export class WaveRunnerManager implements IWaveRunnerManager {
    private static Instance: IWaveRunnerManager
    currentWaveRunnerGame: IWaveRunnerGame

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new WaveRunnerManager()
        }

        return this.Instance
    }

    private constructor() {

    }

    async initialize() {
        importantLog('WaveRunnerManager', 'initialize')

        this.currentWaveRunnerGame = new WaveRunnerGame()
        this.currentWaveRunnerGame.beginWaveRunner()
        this.currentWaveRunnerGame.loadWave(this.getNextWave())
    }

    getNextWave(): IWave {
        const wave = new Wave({
            onSpawn: () => {
                this.currentWaveRunnerGame.spawner.spawn()
            }
        })

        return wave
    }

    get currentWave() {
        return this.currentWaveRunnerGame.currentWave
    }
}
