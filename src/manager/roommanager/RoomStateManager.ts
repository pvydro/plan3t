import { PlanetGameState } from '../../network/schema/planetgamestate/PlanetGameState'
import { WaveRunnerSchema } from '../../network/schema/waverunner/WaveRunnerSchema'
import { log, VerboseLogging } from '../../service/Flogger'
import { WaveRunnerManager } from '../waverunnermanager/WaveRunnerManager'

export interface IRoomStateManager {
    currentState?: PlanetGameState
    stateChanged(newState: PlanetGameState): void
    configureLocalWaveRunner(schema: WaveRunnerSchema): void
}

export class RoomStateManager implements IRoomStateManager {
    currentState?: PlanetGameState

    constructor() {

    }

    stateChanged(newState: PlanetGameState) {
        if (VerboseLogging) log('RoomStateManager', 'newState', newState)

        this.currentState = newState
    }

    configureLocalWaveRunner(schema: WaveRunnerSchema) {
        const waveRunner = WaveRunnerManager.getInstance()
    }
}
