import { log } from '../service/Flogger'
import { IWave, Wave } from './Wave'

export interface IWaveRunnerGame {
    beginWaveRunner(): void
}

export class WaveRunnerGame implements IWaveRunnerGame {
    wave: IWave

    constructor() {

    }

    beginWaveRunner() {
        log('WaveRunnerGame', 'beginWaveRunner')

        this.wave = new Wave()
        this.wave.startSpawnIntervals()
    }
}
