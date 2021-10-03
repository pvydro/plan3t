import { PlayerSchema } from '../../../schema/PlayerSchema'
import { PlanetGameState } from '../../planetgamestate/PlanetGameState'
import { ServerGameState } from '../ServerGameState'

export interface IServerGravityController {
    update(): void
}

export class ServerGravityController implements IServerGravityController {
    state: PlanetGameState | ServerGameState

    constructor(state: PlanetGameState | ServerGameState) {
        this.state = state
    }
 
    update() {
        
        this.players.forEach((p: PlayerSchema, sessionId: string) => {


            if (p.hasSpawned) {
            }
        })

    }

    get players() {
        return this.state.players
    }
}
