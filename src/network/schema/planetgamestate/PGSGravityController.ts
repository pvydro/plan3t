import { PixiPlugin } from 'gsap/all'
import { PlanetRoom } from '../../rooms/planetroom/PlanetRoom'
import { Player } from '../../rooms/Player'
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
        
        this.players.forEach((p: Player, sessionId: string) => {


            if (p.hasSpawned) {
            }
        })

    }

    get players() {
        return this.state.players
    }
}
