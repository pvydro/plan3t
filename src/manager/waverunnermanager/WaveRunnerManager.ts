import { WaveSchema } from '../../network/schema/waverunnergamestate/WaveSchema'
import { log } from '../../service/Flogger'
import { IInGameHUD, InGameHUD } from '../../ui/ingamehud/InGameHUD'
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
    hud: IInGameHUD

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new WaveRunnerManager()
        }

        return this.Instance
    }

    private constructor() {
        this.hud = InGameHUD.getInstance()
    }

    registerWave(schema: WaveSchema) {
        log('WaveRunnerManager', 'registerWave', 'schema', schema)

        this.currentWaveIndex = schema.waveIndex
        this.currentWave = new Wave(schema)
        
        this.hud.loadWave(this.currentWave)
    }
}
