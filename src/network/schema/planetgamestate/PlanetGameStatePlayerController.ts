import { Player, PlayerBodyState } from "../../rooms/Player";
import { PlanetGameState } from "./PlanetGameState";

export interface IPlanetGameStatePlayerController {
    update(): void
}

export class PlanetGameStatePlayerController implements IPlanetGameStatePlayerController {
    state: PlanetGameState

    constructor(state: PlanetGameState) {
        this.state = state
    }

    update() {

        const playerCrouchDivisor: number = 1.75
        const playerWalkingSpeed: number = 1.5
        const playerJumpingHeight: number = 5
        const floorFriction: number = 5
    
        this.players.forEach((p: Player) => {
          switch (p.bodyState) {
            case PlayerBodyState.Idle:
                
              p.xVel = 0

              break
              case PlayerBodyState.Walking:

              p.xVel = playerWalkingSpeed
              
              break
            case PlayerBodyState.Jumping:

              break
          }
        })  
    }

    get players() {
        return this.state.players
    }

    get planetSpherical() {
        return this.state.planetSpherical
    }
}
