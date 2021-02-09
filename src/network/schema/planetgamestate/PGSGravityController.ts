import { PlanetRoom } from "../../rooms/planetroom/PlanetRoom";
import { Player } from "../../rooms/Player";
import { PlanetGameState } from "./PlanetGameState";

export interface IPGSGravityController {
    update(): void
}

export class PGSGravityController implements IPGSGravityController {
    state: PlanetGameState
    // room: Room

    constructor(state: PlanetGameState) {
        this.state = state
        // this.room = 
    }
 
    update() {
        
        this.players.forEach((p: Player) => {

            if (p.hasSpawned) {
                p.yVel += ((p.weight / 3) * 1) * PlanetRoom.Delta//GravityConstants.DropAcceleration <-- Constantintize this
                
                p.x += p.xVel * PlanetRoom.Delta
                p.y += p.yVel * PlanetRoom.Delta
            }

        })
    }

    get players() {
        return this.state.players
    }
}
