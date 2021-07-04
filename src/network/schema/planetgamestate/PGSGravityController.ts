import { PlayerSchema } from '../../schema/PlayerSchema'
import { PlanetGameState } from './PlanetGameState'

export interface IPGSGravityController {
    update(): void
}

export class PGSGravityController implements IPGSGravityController {
    state: PlanetGameState

    constructor(state: PlanetGameState) {
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
