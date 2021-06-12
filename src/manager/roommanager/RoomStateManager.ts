import { PlanetGameState } from '../../network/schema/planetgamestate/PlanetGameState'
import { log, VerboseLogging } from '../../service/Flogger'

export interface IRoomStateManager {
    stateChanged(newState: PlanetGameState): void
}

export class RoomStateManager implements IRoomStateManager {
    constructor() {

    }

    stateChanged(newState: PlanetGameState) {
        if (VerboseLogging) log('RoomStateManager', 'newState', newState)
    }
}
