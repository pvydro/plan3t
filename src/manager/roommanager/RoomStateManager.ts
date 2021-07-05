import { PlanetGameState } from '../../network/schema/planetgamestate/PlanetGameState'
import { WaveRunnerSchema } from '../../network/schema/waverunner/WaveRunnerSchema'
import { log, VerboseLogging } from '../../service/Flogger'
import { WaveRunnerManager } from '../waverunnermanager/WaveRunnerManager'

export interface IRoomStateManager {
    stateChanged(newState: PlanetGameState): void
    configureLocalWaveRunner(schema: WaveRunnerSchema): void
}

export class RoomStateManager implements IRoomStateManager {
    constructor() {

    }

    stateChanged(newState: PlanetGameState) {
        if (VerboseLogging) log('RoomStateManager', 'newState', newState)
    }

    configureLocalWaveRunner(schema: WaveRunnerSchema) {
        const waveRunner = WaveRunnerManager.getInstance()
    }
}
