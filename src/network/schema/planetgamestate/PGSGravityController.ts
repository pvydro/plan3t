import { Player } from "../../rooms/Player";
import { PlanetGameState } from "./PlanetGameState";

export interface IPGSGravityController {
    update(): void
}

export class PGSGravityController implements IPGSGravityController {
    state: PlanetGameState

    constructor(state: PlanetGameState) {
        this.state = state
    }
 
    update() {
        
        this.players.forEach((p: Player) => {

            if (p.hasSpawned) {
                p.yVel += (p.weight / 3) * 1//GravityConstants.DropAcceleration <-- Constantintize this
                
                p.x += p.xVel
                p.y += p.yVel
            }

        })
    }

    get players() {
        return this.state.players
    }
}
