import { WaveSchema } from '../../network/schema/waverunnergamestate/WaveSchema'
import { log } from '../../service/Flogger'
import { inGameHUD } from '../../shared/Dependencies'
import { IWave, Wave } from '../../waverunner/Wave'

export interface IWaveRunnerManager {
    registerWave(schema: WaveSchema): void
    currentWaveIndex: number
    currentWave: IWave
}

export class WaveRunnerManager implements IWaveRunnerManager {
    private static Instance: IWaveRunnerManager
    currentWaveIndex: number
    currentWave: IWave

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new WaveRunnerManager()
        }

        return this.Instance
    }

    private constructor() {
        
    }

    registerWave(schema: WaveSchema) {
        log('WaveRunnerManager', 'registerWave', 'schema', schema)

        this.currentWaveIndex = schema.waveIndex
        this.currentWave = new Wave(schema)
        
        inGameHUD.loadWave(this.currentWave)
    }
}
