import { importantLog } from '../../service/Flogger'
import { IWaveRunnerGame, WaveRunnerGame } from '../../waverunner/WaveRunnerGame'

export interface IWaveRunnerManager {
    initialize(): Promise<void>
}

export class WaveRunnerManager implements IWaveRunnerManager {
    static Instance: IWaveRunnerManager
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
    }
}
