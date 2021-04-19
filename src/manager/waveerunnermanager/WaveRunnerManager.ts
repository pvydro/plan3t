import { log } from '../../service/Flogger'

export interface IWaveRunnerManager {

}

export class WaveRunnerManager implements IWaveRunnerManager {
    static Instance: IWaveRunnerManager
    currentWave: number = 0

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new WaveRunnerManager()
        }

        return this.Instance
    }

    private constructor() {}

    incrementWave() {
        log('WaveRunnerManager', 'incrementWave')

        this.currentWave++
    }
}
